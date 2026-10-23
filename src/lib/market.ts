import { dataSource } from '../data/source';

const pools = dataSource.poolSnapshot();

/** Total sample liquidity across a token's pools, in USD. */
export const liquidityFor = (tokenId: string) =>
  pools.filter((p) => p.tokenA === tokenId || p.tokenB === tokenId).reduce((s, p) => s + p.liquidityUsd, 0);

export const poolCountFor = (tokenId: string) => pools.filter((p) => p.tokenA === tokenId || p.tokenB === tokenId).length;
