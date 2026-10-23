import { ArrowRight, CircleDashed } from 'lucide-react';
import { contactHref } from '../site';
import { PageHead } from './PageHead';

const STATUS = [
  ['Data API', 'Not available'],
  ['API keys & authentication', 'Not available'],
  ['SDKs', 'None published'],
  ['Sandbox / test environment', 'Not available'],
  ['Rate limits & quotas', 'Not defined — no API yet'],
  ['Versioning & changelog', 'Not defined — no API yet'],
  ['API status page', 'None yet'],
] as const;

/* What this build actually does to produce the numbers shown. */
const METHODS = [
  ['Source', 'A fixed sample snapshot bundled with the site. No external data provider is called.'],
  ['Price history', 'Deterministic series per token and range (24H, 7D, 30D) that end at the snapshot price; the 24H series is consistent with the 24h change.'],
  ['Liquidity', 'A token’s liquidity is the sum of the USD liquidity of the pools listed for it on that network.'],
  ['Pool depth', 'The trade size that moves a pool’s marginal price by 2%, using a constant-product model. Concentrated-liquidity pools use virtual reserves.'],
  ['Trade impact', 'Estimated output and price impact for a trade of a given size along direct, two-hop and split paths through the token’s pools. Estimates only.'],
  ['Cross-network', 'Each token listing belongs to one network. The same asset on different networks is a separate record.'],
] as const;

const MODEL = [
  {
    name: 'Token',
    fields: ['id, symbol, name, network', 'price (USD), 24h change', 'market cap, 24h volume', 'liquidity (sum of pools), pool count'],
  },
  {
    name: 'Price history',
    fields: ['token id, range: 24H · 7D · 30D', 'points: timestamp, price (USD)', 'snapshot time of the series'],
  },
  {
    name: 'Pool',
    fields: ['token pair, network', 'type: concentrated, constant product, stable', 'fee tier, reserves', 'liquidity, 24h volume, depth ±2%'],
  },
] as const;

/* A proposal for discussion — none of this is implemented. */
const PROPOSED = [
  ['Search', 'Find tokens by symbol or name across networks.'],
  ['Token details', 'Price, change, market cap, volume and liquidity for one token on one network.'],
  ['Price history', 'Time series for a token over a chosen range.'],
  ['Pools & liquidity', 'Every pool for a token with type, fee tier, liquidity and depth.'],
  ['Market movers', 'Tokens ranked by change or volume, filterable by network.'],
] as const;

const QUESTIONS = [
  'Which networks and assets do you need?',
  'Which data: prices, history, market stats, pools and liquidity?',
  'How much history, and how fresh must the data be?',
  'Expected request volume — and polling or streaming?',
  'Where will the data appear — in your product, internal tools or models?',
] as const;

export function Developers() {
  return (
    <>
      <PageHead eyebrow="Developers" title="Build with Verin data.">
        <p>
          Verin doesn’t have a public data API yet. This page is straight about what exists, how the preview computes its
          numbers, what an API could cover, and how to get involved early.
        </p>
      </PageHead>

      <section className="section section--tight" aria-labelledby="dev-status">
        <div className="container dev__grid">
          <div className="panel dev__status">
            <h2 id="dev-status" className="dev__h">
              Integration status
            </h2>
            <dl className="kv">
              {STATUS.map(([k, val]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd className="dev__na">
                    <CircleDashed size={14} aria-hidden="true" /> {val}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="dev__start">
            <h2 className="dev__h">Start here</h2>
            <ol className="steps dev__steps">
              <li className="steps__item">
                <span className="steps__n num" aria-hidden="true">1</span>
                <span>
                  <strong>Evaluate the behaviour.</strong>{' '}
                  <span className="muted">
                    The <a href="/#preview">interactive preview</a> shows the data and runs the calculations described
                    below, in your browser. <a href="/#data">Data coverage</a> lists exactly what’s included.
                  </span>
                </span>
              </li>
              <li className="steps__item">
                <span className="steps__n num" aria-hidden="true">2</span>
                <span>
                  <strong>Tell us what data you need.</strong>{' '}
                  <span className="muted">Your answers to the questions below decide what the first API covers.</span>
                </span>
              </li>
              <li className="steps__item">
                <span className="steps__n num" aria-hidden="true">3</span>
                <span>
                  <strong>Get early access.</strong>{' '}
                  <span className="muted">Access is arranged directly with the team while the API is designed.</span>
                </span>
              </li>
            </ol>
            <a href={contactHref('api')} className="btn btn--lg">
              Request API access <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="section section--subtle" aria-labelledby="method-title">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Methodology</span>
            <h2 id="method-title">How the preview computes its data.</h2>
            <p>
              Exactly what the code in this build does, so you can judge the approach. Live data will come from real
              sources with their own freshness and coverage; these are the preview’s simplifications.
            </p>
          </div>
          <dl className="router">
            {METHODS.map(([k, val]) => (
              <div key={k} className="router__row">
                <dt>{k}</dt>
                <dd className="muted">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="model-title">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Data model</span>
            <h2 id="model-title">What the preview represents.</h2>
            <p>
              These are the entities and fields the preview works with. They indicate scope, not a published API
              contract — names and shapes will change.
            </p>
          </div>
          <div className="model">
            {MODEL.map((m) => (
              <div key={m.name} className="panel model__card">
                <h3 className="model__h mono">{m.name}</h3>
                <ul className="model__list">
                  {m.fields.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--subtle" aria-labelledby="scope-title">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">
              Proposed scope <span className="badge badge--outline">Not implemented</span>
            </span>
            <h2 id="scope-title">What a Verin data API could cover.</h2>
            <p>
              A starting point for discussion, drawn from what the preview already models. There are no endpoints,
              request formats or limits yet — your requirements decide them.
            </p>
          </div>
          <dl className="router">
            {PROPOSED.map(([k, val]) => (
              <div key={k} className="router__row">
                <dt>{k}</dt>
                <dd className="muted">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="needs-title">
        <div className="container">
          <div className="pricing panel">
            <div className="pricing__text">
              <span className="eyebrow">Shape the API</span>
              <h2 id="needs-title" className="pricing__h">
                Tell us what data you’d integrate.
              </h2>
              <ul className="model__list needs">
                {QUESTIONS.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            </div>
            <div className="pricing__cta">
              <a href={contactHref('api')} className="btn btn--lg">
                Request API access <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a href="/security/" className="btn btn--lg btn--secondary">
                Security &amp; data
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
