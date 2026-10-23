import { Check, Link2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Change } from '../../components/Change';
import { NetworkTag } from '../../components/NetworkTag';
import { PriceChart } from '../../components/PriceChart';
import { Segmented, Tabs } from '../../components/Tabs';
import { TokenAvatar } from '../../components/TokenAvatar';
import { poolLabel, tokenById } from '../../data/sample';
import { dataSource } from '../../data/source';
import type { RangeId } from '../../data/types';
import { formatCompactUsd, formatPrice } from '../../lib/format';
import { liquidityFor, poolCountFor } from '../../lib/market';
import { depthUsd } from '../../lib/routing';
import { useAsync } from '../../lib/useAsync';
import { TradeImpact } from './TradeImpact';

export type DetailTab = 'overview' | 'pools' | 'impact';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'pools', label: 'Pools' },
  { id: 'impact', label: 'Trade impact' },
] as const;

const RANGES = [
  { id: '24H', label: '24H' },
  { id: '7D', label: '7D' },
  { id: '30D', label: '30D' },
] as const;

export function TokenDetail({ id, tab, onTab }: { id: string; tab: DetailTab; onTab: (t: DetailTab) => void }) {
  const token = tokenById(id)!;
  const [range, setRange] = useState<RangeId>('24H');
  const [copied, setCopied] = useState<'idle' | 'done' | 'error'>('idle');
  // Keep the current series on screen while another range loads for the same token.
  const loaded = useAsync(() => dataSource.getPriceHistory(id, range).then((points) => ({ id, points })), [id, range], true);
  const history = loaded?.id === id ? loaded.points : null;
  const day = useAsync(() => dataSource.getPriceHistory(id, '24H'), [id]);
  const pools = useAsync(() => dataSource.getPools(id), [id]);

  useEffect(() => setCopied('idle'), [id]);

  const dayRange = useMemo(() => {
    if (!day) return null;
    const ps = day.map((p) => p.p);
    return { lo: Math.min(...ps), hi: Math.max(...ps) };
  }, [day]);

  const copyLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('token', id);
    url.hash = 'preview';
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied('done');
    } catch {
      setCopied('error');
    }
    window.setTimeout(() => setCopied('idle'), 2000);
  };

  return (
    <div className="tdetail">
      <header className="tdetail__head">
        <div className="tdetail__id">
          <TokenAvatar token={token} size="lg" />
          <div className="tdetail__names">
            <h3 className="tdetail__sym">
              {token.symbol} <span className="tdetail__name">{token.name}</span>
            </h3>
            <NetworkTag id={token.network} />
          </div>
        </div>
        <button type="button" className="btn btn--ghost btn--sm tdetail__copy" onClick={copyLink}>
          {copied === 'done' ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
          <span aria-live="polite">{copied === 'done' ? 'Link copied' : copied === 'error' ? 'Copy failed' : 'Copy link'}</span>
        </button>
      </header>

      <div className="tdetail__price">
        <span className="num tdetail__pricev">{formatPrice(token.priceUsd)}</span>
        <Change value={token.change24h} size={16} />
        <span className="muted tdetail__pricenote">24h</span>
      </div>

      <Tabs label="Token detail" items={TABS} value={tab} onChange={onTab} idBase="tdetail" className="seg tdetail__tabs" />

      <div id="tdetail-panel" role="tabpanel" aria-labelledby={`tdetail-tab-${tab}`} className="tdetail__panel">
        {tab === 'overview' && (
          <>
            <div className="tdetail__chartbar">
              <Segmented label="Chart range" items={RANGES} value={range} onChange={setRange} />
              <span className="muted tdetail__hint">Hover or use arrow keys</span>
            </div>
            <PriceChart points={history} range={range} label={`${token.symbol} price, sample data`} height={220} />
            <dl className="stats">
              <div>
                <dt>Market cap</dt>
                <dd className="num">{formatCompactUsd(token.marketCapUsd)}</dd>
              </div>
              <div>
                <dt>Volume 24h</dt>
                <dd className="num">{formatCompactUsd(token.volume24hUsd)}</dd>
              </div>
              <div>
                <dt>Liquidity</dt>
                <dd className="num">{formatCompactUsd(liquidityFor(id))}</dd>
              </div>
              <div>
                <dt>Pools</dt>
                <dd className="num">{poolCountFor(id)}</dd>
              </div>
              <div>
                <dt>24h low</dt>
                <dd className="num">{dayRange ? formatPrice(dayRange.lo) : '—'}</dd>
              </div>
              <div>
                <dt>24h high</dt>
                <dd className="num">{dayRange ? formatPrice(dayRange.hi) : '—'}</dd>
              </div>
            </dl>
            <p className="note tdetail__addr">
              Contract address and explorer links appear once a live data source is connected.
            </p>
          </>
        )}

        {tab === 'pools' && (
          <div className="pools">
            <p className="muted pools__intro">
              Depth is the trade size, in USD, that moves a pool’s price by 2%. Deeper pools absorb larger orders.
            </p>
            {!pools ? (
              <div className="skeleton" style={{ height: 180 }} aria-hidden="true" />
            ) : (
              <ul className="pools__list">
                {[...pools]
                  .sort((a, b) => b.liquidityUsd - a.liquidityUsd)
                  .map((p) => {
                    const pair = `${tokenById(p.tokenA)!.symbol} / ${tokenById(p.tokenB)!.symbol}`;
                    const depth = depthUsd(p, id, 0.02);
                    return (
                      <li key={p.id} className="pools__item">
                        <div className="pools__pair">
                          <span className="pools__name">{pair}</span>
                          <span className="muted pools__type">{poolLabel(p)}</span>
                        </div>
                        <dl className="pools__nums">
                          <div>
                            <dt>Liquidity</dt>
                            <dd className="num">{formatCompactUsd(p.liquidityUsd)}</dd>
                          </div>
                          <div>
                            <dt>Volume 24h</dt>
                            <dd className="num">{formatCompactUsd(p.volume24hUsd)}</dd>
                          </div>
                          <div>
                            <dt>Depth ±2%</dt>
                            <dd className="num">{formatCompactUsd(depth)}</dd>
                          </div>
                        </dl>
                      </li>
                    );
                  })}
              </ul>
            )}
            <button type="button" className="btn btn--secondary btn--block" onClick={() => onTab('impact')}>
              Estimate trade impact for {token.symbol}
            </button>
          </div>
        )}

        {tab === 'impact' && <TradeImpact targetId={id} />}
      </div>
    </div>
  );
}
