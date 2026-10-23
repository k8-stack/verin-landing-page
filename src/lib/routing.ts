/*
 * Liquidity analytics over a pool snapshot: pool depth and the estimated
 * price impact of a trade along each liquidity path (direct, two-hop, split).
 * Estimates only — nothing here prepares or executes a transaction.
 *
 * Model: every pool is treated as a constant-product (x·y = k) pool.
 * Concentrated-liquidity pools use virtual reserves (reserve × concentration),
 * capped by real reserves. A deliberate simplification for the preview;
 * production estimates need real tick/bin state.
 */
import { networkById, tokenById } from '../data/sample';
import type { NetworkId, Pool } from '../data/types';

export interface Hop {
  pool: Pool;
  tokenIn: string;
  tokenOut: string;
}

export interface Leg {
  hops: Hop[];
  share: number; // 0..1 of input
  amountIn: number;
  amountOut: number;
}

export interface Route {
  id: string;
  kind: 'single' | 'split';
  legs: Leg[];
  amountIn: number;
  amountOut: number;
  /** Fees paid to liquidity providers, in USD. */
  lpFeesUsd: number;
  /** Estimated network cost, in USD. */
  networkCostUsd: number;
  /** Price impact excluding fees, 0..1. */
  priceImpact: number;
  /** USD value of output minus network cost — the ranking metric. */
  netUsd: number;
  hopCount: number;
}

const reserves = (pool: Pool, tokenIn: string) =>
  pool.tokenA === tokenIn
    ? { rIn: pool.reserveA, rOut: pool.reserveB }
    : { rIn: pool.reserveB, rOut: pool.reserveA };

export function swapThroughPool(pool: Pool, tokenIn: string, amountIn: number) {
  const { rIn, rOut } = reserves(pool, tokenIn);
  const vIn = rIn * pool.concentration;
  const vOut = rOut * pool.concentration;
  const fee = pool.feeBps / 10_000;
  const afterFee = amountIn * (1 - fee);
  const out = Math.min((vOut * afterFee) / (vIn + afterFee), rOut * 0.995);
  return { out, feePaid: amountIn * fee };
}

/** Mid-market rate (tokenOut per tokenIn) before fees. */
export const spotRate = (pool: Pool, tokenIn: string) => {
  const { rIn, rOut } = reserves(pool, tokenIn);
  return rOut / rIn;
};

/**
 * Input needed to move the pool's marginal price by `pct` (e.g. 0.02 = 2%),
 * valued in USD. A standard "depth" measure.
 */
export function depthUsd(pool: Pool, tokenIn: string, pct: number) {
  const { rIn } = reserves(pool, tokenIn);
  const dx = rIn * pool.concentration * (Math.sqrt(1 + pct) - 1);
  return Math.min(dx, rIn) * tokenById(tokenIn)!.priceUsd;
}

export function findPaths(pools: Pool[], network: NetworkId, from: string, to: string): Hop[][] {
  const local = pools.filter((p) => p.network === network);
  const other = (p: Pool, t: string) => (p.tokenA === t ? p.tokenB : p.tokenA);
  const touches = (p: Pool, t: string) => p.tokenA === t || p.tokenB === t;
  const paths: Hop[][] = [];

  for (const p of local) {
    if (touches(p, from) && other(p, from) === to) paths.push([{ pool: p, tokenIn: from, tokenOut: to }]);
  }
  for (const p1 of local) {
    if (!touches(p1, from)) continue;
    const mid = other(p1, from);
    if (mid === to) continue;
    for (const p2 of local) {
      if (p2 === p1 || !touches(p2, mid) || other(p2, mid) !== to) continue;
      paths.push([
        { pool: p1, tokenIn: from, tokenOut: mid },
        { pool: p2, tokenIn: mid, tokenOut: to },
      ]);
    }
  }
  return paths;
}

function runLeg(hops: Hop[], amountIn: number) {
  let amount = amountIn;
  let feesUsd = 0;
  let ideal = amountIn;
  for (const hop of hops) {
    const { out, feePaid } = swapThroughPool(hop.pool, hop.tokenIn, amount);
    feesUsd += feePaid * tokenById(hop.tokenIn)!.priceUsd;
    ideal *= spotRate(hop.pool, hop.tokenIn) * (1 - hop.pool.feeBps / 10_000);
    amount = out;
  }
  return { out: amount, feesUsd, ideal };
}

function buildRoute(id: string, parts: { hops: Hop[]; share: number }[], amountIn: number, network: NetworkId, toId: string): Route {
  let amountOut = 0;
  let lpFeesUsd = 0;
  let ideal = 0;
  let hopCount = 0;
  const legs: Leg[] = parts.map(({ hops, share }) => {
    const legIn = amountIn * share;
    const r = runLeg(hops, legIn);
    amountOut += r.out;
    lpFeesUsd += r.feesUsd;
    ideal += r.ideal;
    hopCount += hops.length;
    return { hops, share, amountIn: legIn, amountOut: r.out };
  });
  const networkCostUsd = networkById(network).gasPerHopUsd * (hopCount + (parts.length > 1 ? 0.5 : 0));
  const outPrice = tokenById(toId)!.priceUsd;
  return {
    id,
    kind: parts.length > 1 ? 'split' : 'single',
    legs,
    amountIn,
    amountOut,
    lpFeesUsd,
    networkCostUsd,
    priceImpact: ideal > 0 ? Math.max(0, 1 - amountOut / ideal) : 0,
    netUsd: amountOut * outPrice - networkCostUsd,
    hopCount,
  };
}

const pathKey = (hops: Hop[]) => hops.map((h) => h.pool.id).join('>');

/**
 * Returns candidate routes ranked by net USD received (best first).
 * Includes every single path plus the best two-way split of the top paths.
 */
export function quoteRoutes(pools: Pool[], network: NetworkId, from: string, to: string, amountIn: number): Route[] {
  if (!(amountIn > 0) || from === to) return [];
  const paths = findPaths(pools, network, from, to);
  if (!paths.length) return [];

  const singles = paths.map((hops) => buildRoute(pathKey(hops), [{ hops, share: 1 }], amountIn, network, to));
  singles.sort((a, b) => b.netUsd - a.netUsd);

  const routes = [...singles];
  if (singles.length > 1) {
    const [a, b] = [singles[0].legs[0].hops, singles[1].legs[0].hops];
    let best: Route | null = null;
    for (let s = 0.05; s < 0.999; s += 0.05) {
      const r = buildRoute(`${pathKey(a)}|${pathKey(b)}`, [{ hops: a, share: s }, { hops: b, share: 1 - s }], amountIn, network, to);
      if (!best || r.netUsd > best.netUsd) best = r;
    }
    if (best && best.netUsd > singles[0].netUsd) {
      // Larger share first for readability.
      best.legs.sort((x, y) => y.share - x.share);
      routes.push(best);
    }
  }
  return routes.sort((a, b) => b.netUsd - a.netUsd).slice(0, 4);
}

