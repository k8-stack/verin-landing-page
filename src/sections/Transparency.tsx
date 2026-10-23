import { CheckCircle2, CircleDashed, Clock3 } from 'lucide-react';
import { Change } from '../components/Change';
import { NetworkTag } from '../components/NetworkTag';
import { NETWORKS, poolsForToken, SAMPLE_AS_OF, TOKENS, tokenById } from '../data/sample';
import { formatCompactUsd, formatPrice, formatUtcStamp } from '../lib/format';
import { liquidityFor } from '../lib/market';

const aero = tokenById('aero-base')!;

const ANNOTATIONS = [
  ['Snapshot time', 'Every value carries the time it was taken. Stale data is labelled, not hidden.'],
  ['Data source', 'Where the number came from. In this preview it always reads “Sample data”.'],
  ['Network', 'The same asset trades separately on each network, so every figure is tied to one.'],
  ['Liquidity basis', 'Liquidity is the sum of the pools listed for the token — you can open each one.'],
  ['History range', 'Which windows of price history exist for this record.'],
] as const;

/* Verified against this build. Anything not yet decided says so. */
const COVERAGE = [
  ['Networks', NETWORKS.map((n) => n.name).join(', ') + ' (preview set)'],
  ['Assets', `${TOKENS.length} token listings across those networks (sample)`],
  ['Data categories', 'Price, 24h change, market cap, 24h volume, liquidity, pools (type, fee tier, depth), price history'],
  ['Price history', '24H, 7D and 30D sample series per token'],
  ['Update frequency', 'Static snapshot in this preview. Live update frequency is not yet determined.'],
  ['Data sources', 'None connected. All values are illustrative sample data.'],
  ['API access', 'Not available yet — see the developer overview.'],
  ['Known limitations', 'No contract addresses, no wallet or holder data, no cross-network bridging data.'],
] as const;

const REAL = [
  'Token search, network filters, views and sorting',
  'Price charts with hover and keyboard tooltips',
  'Pool liquidity and depth calculations',
  'Trade-impact estimates across a token’s pools',
];
const NOT_YET = [
  'Live market data from a data provider',
  'Data API, keys and documentation',
  'Historical data beyond the sample ranges',
  'Contract addresses and block-explorer links',
];

export function Transparency() {
  return (
    <section id="transparency" className="section section--subtle" aria-labelledby="tr-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">
            <span className="dot-label">04</span> Data &amp; transparency
          </span>
          <h2 id="tr-title">Every number shows where it came from.</h2>
          <p>Market data is only useful if you can tell how fresh it is and what it’s based on. This is how a Verin token record reads.</p>
        </div>

        <div className="anat">
          <figure className="anat__quote panel panel--raised" aria-label="Annotated example token record">
            <div className="anat__row anat__row--top">
              <span className="anat__mark num" aria-hidden="true">1</span>
              <span className="anat__stamp">
                <Clock3 size={14} aria-hidden="true" /> {formatUtcStamp(SAMPLE_AS_OF)}
              </span>
              <span className="anat__mark num" aria-hidden="true">2</span>
              <span className="badge badge--sample">Sample data</span>
            </div>
            <p className="anat__headline">
              {aero.symbol} <span className="num">{formatPrice(aero.priceUsd)}</span>
            </p>
            <p className="anat__sub">
              <Change value={aero.change24h} /> <span className="muted">24h · {aero.name}</span>
            </p>
            <dl className="kv anat__kv">
              <div>
                <dt>
                  <span className="anat__mark num" aria-hidden="true">3</span> Network
                </dt>
                <dd>
                  <NetworkTag id={aero.network} />
                </dd>
              </div>
              <div>
                <dt>Market cap · volume 24h</dt>
                <dd>
                  {formatCompactUsd(aero.marketCapUsd)} · {formatCompactUsd(aero.volume24hUsd)}
                </dd>
              </div>
              <div>
                <dt>
                  <span className="anat__mark num" aria-hidden="true">4</span> Liquidity
                </dt>
                <dd>
                  {formatCompactUsd(liquidityFor(aero.id))} in {poolsForToken(aero.id).length} pools
                </dd>
              </div>
              <div>
                <dt>
                  <span className="anat__mark num" aria-hidden="true">5</span> History
                </dt>
                <dd>24H · 7D · 30D</dd>
              </div>
            </dl>
          </figure>

          <ol className="anat__notes">
            {ANNOTATIONS.map(([title, text], i) => (
              <li key={title} className="anat__note">
                <span className="anat__mark num" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className="anat__h">{title}</h3>
                  <p className="muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div id="data" className="states coverage">
          <h3 className="states__h">Data coverage in this preview</h3>
          <dl className="router">
            {COVERAGE.map(([k, v]) => (
              <div key={k} className="router__row">
                <dt>{k}</dt>
                <dd className="muted">
                  {k === 'API access' ? (
                    <>
                      Not available yet — see the <a href="/developers/">developer overview</a>.
                    </>
                  ) : (
                    v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="status">
          <div className="status__col">
            <h3 className="status__h">Working in this preview</h3>
            <ul>
              {REAL.map((r) => (
                <li key={r}>
                  <CheckCircle2 size={18} aria-hidden="true" className="status__ok" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="status__col">
            <h3 className="status__h">Not connected yet</h3>
            <ul>
              {NOT_YET.map((r) => (
                <li key={r}>
                  <CircleDashed size={18} aria-hidden="true" className="status__no" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
