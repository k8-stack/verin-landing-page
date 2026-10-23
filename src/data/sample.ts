/*
 * SAMPLE DATA — for the landing-page preview only.
 * Prices, volumes, reserves and histories below are illustrative values,
 * not market data. Every surface that renders them shows a "Sample data" label.
 */
import type { Network, NetworkId, Pool, PoolKind, PricePoint, RangeId, Token, TokenTone } from './types';

/** Fixed snapshot time for the sample set (not a market timestamp). */
export const SAMPLE_AS_OF = Date.UTC(2026, 9, 23, 12, 0, 0);

export const NETWORKS: Network[] = [
  { id: 'base', name: 'Base', gasPerHopUsd: 0.01 },
  { id: 'ethereum', name: 'Ethereum', gasPerHopUsd: 2.4 },
  { id: 'arbitrum', name: 'Arbitrum', gasPerHopUsd: 0.04 },
  { id: 'optimism', name: 'Optimism', gasPerHopUsd: 0.02 },
];

export const networkById = (id: NetworkId) => NETWORKS.find((n) => n.id === id)!;

type TokenSeed = [
  symbol: string,
  name: string,
  network: NetworkId,
  price: number,
  change: number,
  mcap: number,
  vol: number,
  tone: TokenTone,
];

const B = 1e9;
const M = 1e6;

const SEEDS: TokenSeed[] = [
  ['ETH', 'Ether', 'base', 3412.8, 2.31, 411 * B, 1.84 * B, 'ink'],
  ['USDC', 'USD Coin', 'base', 1.0, 0.01, 76.2 * B, 2.1 * B, 'cerulean'],
  ['cbBTC', 'Coinbase Wrapped BTC', 'base', 98240, 1.47, 4.8 * B, 410 * M, 'yellow'],
  ['AERO', 'Aerodrome', 'base', 1.284, 6.42, 1.1 * B, 96 * M, 'blue'],
  ['VIRTUAL', 'Virtuals Protocol', 'base', 1.918, 11.36, 1.25 * B, 160 * M, 'lime'],
  ['BRETT', 'Brett', 'base', 0.06142, -2.71, 608 * M, 22 * M, 'cerulean'],
  ['DEGEN', 'Degen', 'base', 0.007421, -4.18, 92 * M, 14 * M, 'pink'],
  ['ETH', 'Ether', 'ethereum', 3413.95, 2.29, 411 * B, 6.2 * B, 'ink'],
  ['USDC', 'USD Coin', 'ethereum', 1.0, 0.0, 76.2 * B, 5.4 * B, 'cerulean'],
  ['LINK', 'Chainlink', 'ethereum', 18.42, 1.12, 11.5 * B, 480 * M, 'blue'],
  ['UNI', 'Uniswap', 'ethereum', 9.864, -0.84, 5.9 * B, 210 * M, 'pink'],
  ['PEPE', 'Pepe', 'ethereum', 0.00001184, 3.27, 4.98 * B, 900 * M, 'green'],
  ['ETH', 'Ether', 'arbitrum', 3412.1, 2.33, 411 * B, 820 * M, 'ink'],
  ['USDC', 'USD Coin', 'arbitrum', 1.0, 0.01, 76.2 * B, 640 * M, 'cerulean'],
  ['ARB', 'Arbitrum', 'arbitrum', 0.6124, -1.93, 2.6 * B, 240 * M, 'cerulean'],
  ['GMX', 'GMX', 'arbitrum', 24.31, 0.56, 245 * M, 18 * M, 'tan'],
  ['ETH', 'Ether', 'optimism', 3411.6, 2.27, 411 * B, 210 * M, 'ink'],
  ['USDC', 'USD Coin', 'optimism', 1.0, -0.01, 76.2 * B, 180 * M, 'cerulean'],
  ['OP', 'Optimism', 'optimism', 1.472, 2.18, 2.3 * B, 150 * M, 'red'],
  ['VELO', 'Velodrome', 'optimism', 0.09213, -3.44, 82 * M, 5 * M, 'gray'],
];

export const tokenId = (symbol: string, network: NetworkId) => `${symbol.toLowerCase()}-${network}`;

export const TOKENS: Token[] = SEEDS.map(([symbol, name, network, price, change, mcap, vol, tone]) => ({
  id: tokenId(symbol, network),
  symbol,
  name,
  network,
  priceUsd: price,
  change24h: change,
  marketCapUsd: mcap,
  volume24hUsd: vol,
  tone,
}));

const tokenMap = new Map(TOKENS.map((t) => [t.id, t]));
export const tokenById = (id: string) => tokenMap.get(id);

type PoolSeed = [network: NetworkId, a: string, b: string, kind: PoolKind, feeBps: number, tvl: number, conc: number];

const POOL_SEEDS: PoolSeed[] = [
  ['base', 'ETH', 'USDC', 'cl', 5, 48 * M, 6],
  ['base', 'ETH', 'USDC', 'v2', 30, 9 * M, 1],
  ['base', 'cbBTC', 'USDC', 'cl', 5, 22 * M, 6],
  ['base', 'cbBTC', 'ETH', 'cl', 5, 30 * M, 5],
  ['base', 'AERO', 'USDC', 'cl', 30, 6 * M, 3],
  ['base', 'AERO', 'ETH', 'v2', 30, 14 * M, 1],
  ['base', 'VIRTUAL', 'ETH', 'v2', 30, 8 * M, 1],
  ['base', 'VIRTUAL', 'USDC', 'cl', 30, 2.5 * M, 3],
  ['base', 'BRETT', 'ETH', 'v2', 30, 5 * M, 1],
  ['base', 'DEGEN', 'ETH', 'v2', 100, 3.2 * M, 1],
  ['base', 'DEGEN', 'ETH', 'cl', 30, 1.8 * M, 3],
  ['ethereum', 'ETH', 'USDC', 'cl', 5, 180 * M, 8],
  ['ethereum', 'ETH', 'USDC', 'v2', 30, 40 * M, 1],
  ['ethereum', 'LINK', 'ETH', 'cl', 30, 24 * M, 3],
  ['ethereum', 'LINK', 'USDC', 'v2', 30, 6 * M, 1],
  ['ethereum', 'UNI', 'ETH', 'cl', 30, 30 * M, 3],
  ['ethereum', 'UNI', 'USDC', 'v2', 30, 4 * M, 1],
  ['ethereum', 'PEPE', 'ETH', 'cl', 30, 20 * M, 3],
  ['ethereum', 'PEPE', 'ETH', 'v2', 30, 18 * M, 1],
  ['arbitrum', 'ETH', 'USDC', 'cl', 5, 60 * M, 6],
  ['arbitrum', 'ARB', 'ETH', 'cl', 5, 18 * M, 4],
  ['arbitrum', 'ARB', 'USDC', 'cl', 5, 9 * M, 4],
  ['arbitrum', 'GMX', 'ETH', 'cl', 30, 7 * M, 3],
  ['optimism', 'ETH', 'USDC', 'cl', 5, 22 * M, 6],
  ['optimism', 'OP', 'USDC', 'cl', 30, 8 * M, 3],
  ['optimism', 'OP', 'ETH', 'v2', 30, 6 * M, 1],
  ['optimism', 'VELO', 'USDC', 'v2', 30, 3 * M, 1],
  ['optimism', 'VELO', 'OP', 'v2', 30, 2 * M, 1],
];

export const POOLS: Pool[] = POOL_SEEDS.map(([network, a, b, kind, feeBps, tvl, conc], i) => {
  const ta = tokenById(tokenId(a, network))!;
  const tb = tokenById(tokenId(b, network))!;
  return {
    id: `pool-${i + 1}`,
    network,
    tokenA: ta.id,
    tokenB: tb.id,
    kind,
    feeBps,
    reserveA: tvl / 2 / ta.priceUsd,
    reserveB: tvl / 2 / tb.priceUsd,
    concentration: conc,
    liquidityUsd: tvl,
    volume24hUsd: 0, // filled below
  };
});

// Distribute each token's sample volume across its pools by liquidity share.
for (const pool of POOLS) {
  const a = tokenById(pool.tokenA)!;
  const aPools = POOLS.filter((p) => p.tokenA === a.id || p.tokenB === a.id);
  const total = aPools.reduce((s, p) => s + p.liquidityUsd, 0);
  pool.volume24hUsd = Math.min(a.volume24hUsd, tokenById(pool.tokenB)!.volume24hUsd) * (pool.liquidityUsd / total);
}

export const poolsForToken = (id: string) => POOLS.filter((p) => p.tokenA === id || p.tokenB === id);

export const poolLabel = (p: Pool) =>
  `${p.kind === 'cl' ? 'Concentrated' : p.kind === 'stable' ? 'Stable' : 'Constant product'} · ${(p.feeBps / 100).toFixed(2)}%`;

/* ---- Deterministic sample price histories ---- */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

const RANGE_SPEC: Record<RangeId, { points: number; stepMs: number; volScale: number }> = {
  '24H': { points: 97, stepMs: 15 * 60 * 1000, volScale: 1 },
  '7D': { points: 169, stepMs: 60 * 60 * 1000, volScale: 2.4 },
  '30D': { points: 121, stepMs: 6 * 60 * 60 * 1000, volScale: 4.8 },
};

/**
 * Brownian bridge in log-price space from a start price to the snapshot price.
 * For 24H the start is derived from the token's 24h change so chart and stats agree.
 */
export function sampleHistory(token: Token, range: RangeId): PricePoint[] {
  const spec = RANGE_SPEC[range];
  const rand = mulberry32(hash(token.id + range));
  const stable = token.symbol === 'USDC';
  const vol = (stable ? 0.0002 : token.marketCapUsd > 50e9 ? 0.0035 : 0.007) * Math.sqrt(spec.volScale);

  const end = Math.log(token.priceUsd);
  const startChange =
    range === '24H' ? token.change24h / 100 : (rand() - 0.42) * (stable ? 0.001 : 0.09 * spec.volScale);
  const start = Math.log(token.priceUsd / (1 + startChange));

  const n = spec.points;
  const walk = [0];
  for (let i = 1; i < n; i++) {
    const g = (rand() + rand() + rand() - 1.5) * 2; // ~N(0,1)
    walk.push(walk[i - 1] + g * vol);
  }
  const last = walk[n - 1];
  return walk.map((w, i) => {
    const f = i / (n - 1);
    const logP = start + (end - start) * f + (w - last * f);
    return { t: SAMPLE_AS_OF - (n - 1 - i) * spec.stepMs, p: Math.exp(logP) };
  });
}
