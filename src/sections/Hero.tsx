import { ArrowRight, Search } from 'lucide-react';
import { Change } from '../components/Change';
import { NetworkTag } from '../components/NetworkTag';
import { PriceChart } from '../components/PriceChart';
import { SampleBadge } from '../components/SampleBadge';
import { TokenAvatar } from '../components/TokenAvatar';
import { poolLabel, poolsForToken, sampleHistory, tokenById } from '../data/sample';
import { formatCompactUsd, formatPrice } from '../lib/format';
import { liquidityFor } from '../lib/market';

const aero = tokenById('aero-base')!;
const aeroHistory = sampleHistory(aero, '24H');
const aeroPools = [...poolsForToken(aero.id)].sort((a, b) => b.liquidityUsd - a.liquidityUsd);
const maxPool = Math.max(...aeroPools.map((p) => p.liquidityUsd));

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">
            <span className="badge badge--outline">Preview build</span>
            Crypto market intelligence &amp; onchain data
          </p>
          <h1 id="hero-title" className="hero__title">
            Explore crypto markets. <span className="hero__title-accent">Build with onchain data.</span>
          </h1>
          <p className="hero__lead">
            Verin brings token discovery, prices, price history and pool-level liquidity across networks into one clear
            view — for people researching markets and for teams building products on market data.
          </p>
          <div className="hero__ctas">
            <a href="#preview" className="btn btn--lg">
              Explore the preview <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="/developers/" className="btn btn--lg btn--secondary">
              Build with Verin data
            </a>
          </div>
          <ul className="hero__facts">
            <li>
              <strong>4 networks</strong> in this preview
            </li>
            <li>
              Price, history &amp; <strong>liquidity</strong> per token
            </li>
            <li>
              <strong>No account</strong> needed to explore
            </li>
          </ul>
        </div>

        <div className="hero__visual" aria-label="Product preview: searching for AERO, its price and its liquidity by pool" role="group">
          <div className="hero__stage">
            <div className="hv hv--search panel">
              <div className="hv__searchbar">
                <Search size={18} aria-hidden="true" />
                <span className="hv__query">aero</span>
                <span className="hv__caret" aria-hidden="true" />
              </div>
              <div className="hv__result">
                <TokenAvatar token={aero} />
                <span className="hv__names">
                  <span className="hv__sym">{aero.symbol}</span>
                  <NetworkTag id={aero.network} />
                </span>
                <span className="hv__right">
                  <span className="num hv__price">{formatPrice(aero.priceUsd)}</span>
                  <Change value={aero.change24h} />
                </span>
              </div>
            </div>

            <div className="hv hv--chart panel">
              <div className="hv__charthead">
                <span className="hv__label">AERO · 24H</span>
                <SampleBadge />
              </div>
              <PriceChart points={aeroHistory} range="24H" height={96} label="AERO 24 hour price, sample data" compact />
              <dl className="hv__stats">
                <div>
                  <dt>Liquidity</dt>
                  <dd className="num">{formatCompactUsd(liquidityFor(aero.id))}</dd>
                </div>
                <div>
                  <dt>Volume 24h</dt>
                  <dd className="num">{formatCompactUsd(aero.volume24hUsd)}</dd>
                </div>
              </dl>
            </div>

            <div className="hv hv--route">
              <div className="hv__routehead">
                <span className="hv__label">AERO · Liquidity by pool</span>
                <span className="hv__label hv__label--muted">Base</span>
              </div>
              <div className="panel hv__pools">
                <ul className="hv__poollist">
                  {aeroPools.map((p) => (
                    <li key={p.id} className="hv__pool">
                      <span className="hv__poolname">
                        {tokenById(p.tokenA)!.symbol} / {tokenById(p.tokenB)!.symbol}
                        <span className="muted hv__pooltype">{poolLabel(p)}</span>
                      </span>
                      <span className="num hv__poolval">{formatCompactUsd(p.liquidityUsd)}</span>
                      <span className="hv__poolbar" aria-hidden="true">
                        <span style={{ width: `${(p.liquidityUsd / maxPool) * 100}%` }} />
                      </span>
                    </li>
                  ))}
                </ul>
                <dl className="hv__stats hv__poolstats">
                  <div>
                    <dt>Pools</dt>
                    <dd className="num">{aeroPools.length}</dd>
                  </div>
                  <div>
                    <dt>Market cap</dt>
                    <dd className="num">{formatCompactUsd(aero.marketCapUsd)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
