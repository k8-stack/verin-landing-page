import { ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';
import { Change } from '../components/Change';
import { NetworkTag } from '../components/NetworkTag';
import { PriceChart } from '../components/PriceChart';
import { Tabs } from '../components/Tabs';
import { TokenAvatar } from '../components/TokenAvatar';
import { poolLabel, poolsForToken, sampleHistory, tokenById, TOKENS } from '../data/sample';
import { formatCompactUsd, formatPct, formatPrice } from '../lib/format';
import { liquidityFor, poolCountFor } from '../lib/market';
import { depthUsd } from '../lib/routing';

type StepId = 'discover' | 'inspect' | 'analyse' | 'integrate';

const STEPS: { id: StepId; n: string; title: string; text: string }[] = [
  {
    id: 'discover',
    n: '01',
    title: 'Discover',
    text: 'Search by symbol or name across every network at once. Filter to one network, or sort by volume, liquidity or 24h change.',
  },
  {
    id: 'inspect',
    n: '02',
    title: 'Inspect',
    text: 'Open a token to see its price history, market stats and the pools that make up its liquidity.',
  },
  {
    id: 'analyse',
    n: '03',
    title: 'Analyse',
    text: 'See where the liquidity sits: every pool, its type and fee tier, and how much size each can absorb.',
  },
  {
    id: 'integrate',
    n: '04',
    title: 'Integrate',
    text: 'Each token is one structured record — price, market stats, history and pools — ready to power your own product.',
  },
];

const link = tokenById('link-ethereum')!;
const linkHistory = sampleHistory(link, '7D');
const linkPools = [...poolsForToken(link.id)].sort((a, b) => b.liquidityUsd - a.liquidityUsd);
const ethResults = TOKENS.filter((t) => t.symbol === 'ETH');

function StepVisual({ id }: { id: StepId }) {
  if (id === 'discover')
    return (
      <div className="wv">
        <div className="wv__search">
          <Search size={18} aria-hidden="true" />
          <span>eth</span>
          <span className="muted wv__count">{ethResults.length} results</span>
        </div>
        <ul className="wv__list">
          {ethResults.map((t) => (
            <li key={t.id} className="wv__row">
              <TokenAvatar token={t} size="sm" />
              <span className="wv__sym">{t.symbol}</span>
              <NetworkTag id={t.network} />
              <span className="num wv__price">{formatPrice(t.priceUsd)}</span>
            </li>
          ))}
        </ul>
      </div>
    );

  if (id === 'inspect')
    return (
      <div className="wv">
        <div className="wv__tokenhead">
          <TokenAvatar token={link} />
          <span className="wv__sym">{link.symbol}</span>
          <span className="num">{formatPrice(link.priceUsd)}</span>
          <Change value={link.change24h} />
        </div>
        <PriceChart points={linkHistory} range="7D" height={110} label="LINK 7 day price, sample data" compact />
        <dl className="wv__stats">
          <div>
            <dt>Liquidity</dt>
            <dd className="num">{formatCompactUsd(liquidityFor(link.id))}</dd>
          </div>
          <div>
            <dt>Pools</dt>
            <dd className="num">{poolCountFor(link.id)}</dd>
          </div>
          <div>
            <dt>Volume 24h</dt>
            <dd className="num">{formatCompactUsd(link.volume24hUsd)}</dd>
          </div>
        </dl>
      </div>
    );

  if (id === 'analyse')
    return (
      <div className="wv">
        <p className="wv__caption">LINK · Ethereum · liquidity by pool</p>
        <ul className="wv__list">
          {linkPools.map((p) => (
            <li key={p.id} className="wv__row wv__row--pool">
              <span className="wv__sym">
                {tokenById(p.tokenA)!.symbol} / {tokenById(p.tokenB)!.symbol}
              </span>
              <span className="muted wv__pooltype">{poolLabel(p)}</span>
              <span className="wv__poolnums">
                <span className="num">{formatCompactUsd(p.liquidityUsd)}</span>
                <span className="muted num">±2% depth {formatCompactUsd(depthUsd(p, link.id, 0.02))}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );

  return (
    <div className="wv">
      <p className="wv__caption">Token record · LINK on Ethereum</p>
      <dl className="kv">
        <div>
          <dt>id</dt>
          <dd>{link.id}</dd>
        </div>
        <div>
          <dt>price_usd</dt>
          <dd>{formatPrice(link.priceUsd)}</dd>
        </div>
        <div>
          <dt>change_24h</dt>
          <dd>{formatPct(link.change24h)}</dd>
        </div>
        <div>
          <dt>market_cap_usd · volume_24h_usd</dt>
          <dd>
            {formatCompactUsd(link.marketCapUsd)} · {formatCompactUsd(link.volume24hUsd)}
          </dd>
        </div>
        <div>
          <dt>liquidity_usd · pools</dt>
          <dd>
            {formatCompactUsd(liquidityFor(link.id))} · {poolCountFor(link.id)}
          </dd>
        </div>
        <div>
          <dt>history</dt>
          <dd>24H · 7D · 30D</dd>
        </div>
      </dl>
      <p className="note wv__note">
        This is how the preview structures a token internally — not a published API response. A data API is not available
        yet; <a href="/developers/">see the developer overview</a>.
      </p>
    </div>
  );
}

export function Walkthrough() {
  const [step, setStep] = useState<StepId>('discover');
  const current = STEPS.find((s) => s.id === step)!;

  return (
    <section id="how" className="section section--subtle" aria-labelledby="how-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">
            <span className="dot-label">03</span> How it works
          </span>
          <h2 id="how-title">From a ticker to data you can build on.</h2>
        </div>

        <div className="walk">
          <Tabs
            label="Steps"
            idBase="walk"
            orientation="vertical"
            className="walk__tabs"
            tabClassName="walk__tab"
            value={step}
            onChange={setStep}
            items={STEPS.map((s) => ({
              id: s.id,
              label: (
                <>
                  <span className="walk__n dot-label">{s.n}</span>
                  <span className="walk__tabtext">
                    <span className="walk__title">{s.title}</span>
                    <span className="walk__desc">{s.text}</span>
                  </span>
                </>
              ),
            }))}
          />
          <div id="walk-panel" role="tabpanel" aria-labelledby={`walk-tab-${step}`} className="walk__panel panel" tabIndex={0}>
            <div className="walk__panelhead">
              <span className="walk__paneltitle">
                {current.n} · {current.title}
              </span>
              <span className="badge badge--sample">Sample data</span>
            </div>
            <StepVisual id={step} />
            {step === 'integrate' ? (
              <a href="/developers/" className="walk__try">
                Read the developer overview <ArrowRight size={16} aria-hidden="true" />
              </a>
            ) : (
              <a href="#preview" className="walk__try">
                Try this step in the preview <ArrowRight size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
