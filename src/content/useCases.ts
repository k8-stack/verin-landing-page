import type { InquiryType } from '../site';

export interface UseCase {
  id: string;
  segment: string;
  /** One-line summary for compact lists. */
  summary: string;
  problem: string;
  helps: string[];
  /** Where to see it working today, inside the preview. */
  seeIt: { href: string; label: string };
  next: { type: InquiryType; label: string };
}

/*
 * Every "helps" item describes data or behaviour that exists in the preview.
 * Nothing here implies a hosted service, API, integration or SLA is available.
 */
export const USE_CASES: UseCase[] = [
  {
    id: 'wallets',
    segment: 'Wallets and consumer crypto apps',
    summary: 'Show users trustworthy token pages: price, history and the liquidity behind them.',
    problem:
      'Users see tokens they’ve never heard of in their balances and feeds. A bare price doesn’t tell them whether a token is widely traded or held up by one thin pool.',
    helps: [
      'Token search across networks, with the network on every result',
      'Price, 24h change, market cap, volume and price history in one record',
      'Liquidity by pool, so thin markets are visible at a glance',
    ],
    seeIt: { href: '/#preview', label: 'Search and open a token' },
    next: { type: 'integration', label: 'Talk about integrating' },
  },
  {
    id: 'trading',
    segment: 'Trading platforms and terminals',
    summary: 'Give traders market context: movers, volume and pool-level depth.',
    problem:
      'Traders need to know what’s moving and whether there’s enough liquidity to act on it. Prices alone hide how much size a market can take.',
    helps: [
      'Movers ranked by 24h change, shown with network and volume',
      'Depth: the trade size that moves each pool’s price by 2%',
      'Trade-impact estimates for a given size across a token’s pools',
    ],
    seeIt: { href: '/#capabilities', label: 'See depth and movers' },
    next: { type: 'api', label: 'Ask about data access' },
  },
  {
    id: 'analytics',
    segment: 'Analytics and research products',
    summary: 'Work from structured market records instead of scraping prices.',
    problem:
      'Research and analytics teams spend time stitching prices, volumes and liquidity together per network before they can analyse anything.',
    helps: [
      'One consistent record per token per network',
      'Pool-level liquidity, fee tier and pool type',
      'The same asset compared across networks',
    ],
    seeIt: { href: '/#how', label: 'See the token record' },
    next: { type: 'api', label: 'Talk about data access' },
  },
  {
    id: 'protocols',
    segment: 'DeFi protocols and token teams',
    summary: 'Understand where your token’s liquidity sits and how it trades.',
    problem:
      'Liquidity is usually split across pool types and networks. Teams need to see which pools carry real depth and how a trade of a given size would move the price.',
    helps: [
      'Every pool for a token, with liquidity, volume and depth',
      'Estimated price impact at different trade sizes',
      'Cross-network view of the same asset',
    ],
    seeIt: { href: '/?token=aero-base#preview', label: 'Open a token’s pools' },
    next: { type: 'partnership', label: 'Explore a partnership' },
  },
  {
    id: 'developers',
    segment: 'Developers building market-data apps',
    summary: 'Start from a clear data model for tokens, pools and history.',
    problem:
      'Building a market-data product means deciding early how tokens, networks, pools and history fit together — and living with that model.',
    helps: [
      'A worked data model for tokens, pools and price history',
      'Documented methods for liquidity and depth calculations',
      'An honest view of what exists today and what doesn’t',
    ],
    seeIt: { href: '/developers/', label: 'Read the developer overview' },
    next: { type: 'api', label: 'Request API access' },
  },
];
