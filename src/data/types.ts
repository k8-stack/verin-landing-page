export type NetworkId = 'base' | 'ethereum' | 'arbitrum' | 'optimism';

export interface Network {
  id: NetworkId;
  name: string;
  /** Sample network cost per trade hop, in USD. Replace with live gas estimates. */
  gasPerHopUsd: number;
}

/** Monogram fill for token avatars; maps to Base palette tokens in CSS. */
export type TokenTone =
  | 'blue'
  | 'ink'
  | 'cerulean'
  | 'yellow'
  | 'green'
  | 'lime'
  | 'pink'
  | 'tan'
  | 'red'
  | 'gray';

export interface Token {
  /** `${symbol}-${network}`, lower case. Stable across adapters. */
  id: string;
  symbol: string;
  name: string;
  network: NetworkId;
  priceUsd: number;
  change24h: number; // percent, e.g. 6.42
  marketCapUsd: number;
  volume24hUsd: number;
  tone: TokenTone;
}

export type PoolKind = 'cl' | 'v2' | 'stable';

export interface Pool {
  id: string;
  network: NetworkId;
  tokenA: string; // token id
  tokenB: string; // token id
  kind: PoolKind;
  feeBps: number;
  reserveA: number; // units of tokenA
  reserveB: number; // units of tokenB
  /**
   * Liquidity concentration multiplier used to approximate concentrated
   * liquidity as a constant-product pool with virtual reserves.
   */
  concentration: number;
  liquidityUsd: number;
  volume24hUsd: number;
}

export type RangeId = '24H' | '7D' | '30D';

export interface PricePoint {
  t: number; // unix ms
  p: number; // USD
}

export interface DataSourceInfo {
  kind: 'sample' | 'live';
  /** Human-readable provenance shown next to every data surface. */
  label: string;
  /** Timestamp of the snapshot the data represents. */
  asOf: number;
}
