/*
 * Market data adapter boundary.
 *
 * The landing page talks only to `MarketDataSource`. Today the only
 * implementation is `sampleSource`, backed by illustrative values.
 * A live adapter (e.g. an onchain data API) should implement the same
 * interface and set `info.kind = 'live'` with a real provenance label.
 */
import { POOLS, SAMPLE_AS_OF, TOKENS, poolsForToken, sampleHistory, tokenById } from './sample';
import type { DataSourceInfo, Pool, PricePoint, RangeId, Token } from './types';

export interface MarketDataSource {
  info: DataSourceInfo;
  listTokens(): Promise<Token[]>;
  getToken(id: string): Promise<Token | undefined>;
  getPriceHistory(id: string, range: RangeId): Promise<PricePoint[]>;
  getPools(tokenId: string): Promise<Pool[]>;
  /** Synchronous pool snapshot for client-side liquidity and trade-impact maths. */
  poolSnapshot(): Pool[];
}

/** Small artificial latency so loading states are exercised in the preview. */
const delay = <T,>(value: T, ms = 180) => new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export const sampleSource: MarketDataSource = {
  info: {
    kind: 'sample',
    label: 'Sample data — not live market prices',
    asOf: SAMPLE_AS_OF,
  },
  listTokens: () => delay(TOKENS, 120),
  getToken: (id) => delay(tokenById(id), 0),
  getPriceHistory: (id, range) => {
    const token = tokenById(id);
    return delay(token ? sampleHistory(token, range) : []);
  },
  getPools: (tokenId) => delay(poolsForToken(tokenId), 120),
  poolSnapshot: () => POOLS,
};

export const dataSource: MarketDataSource = sampleSource;
