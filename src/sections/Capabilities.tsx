import { SampleBadge } from '../components/SampleBadge';
import { NetworkTag } from '../components/NetworkTag';
import { Change } from '../components/Change';
import { NETWORKS, poolLabel, poolsForToken, tokenById, TOKENS } from '../data/sample';
import { formatCompactUsd, formatPrice, formatUsd } from '../lib/format';
import { depthUsd } from '../lib/routing';

/* ---- 1. Liquidity behind a price (AERO on Base) ---- */
const aeroPools = poolsForToken('aero-base')
  .map((p) => ({
    pool: p,
    pair: `${tokenById(p.tokenA)!.symbol} / ${tokenById(p.tokenB)!.symbol}`,
    depth: depthUsd(p, 'aero-base', 0.02),
  }))
  .sort((a, b) => b.depth - a.depth);
const maxDepth = Math.max(...aeroPools.map((p) => p.depth));

/* ---- 2. ETH across networks ---- */
const ethRows = TOKENS.filter((t) => t.symbol === 'ETH').map((t) => ({
  token: t,
  gas: NETWORKS.find((n) => n.id === t.network)!.gasPerHopUsd,
}));
const ethMedian = [...ethRows].map((r) => r.token.priceUsd).sort((a, b) => a - b)[1];

/* ---- 3. Market movement across networks ---- */
const movers = [...TOKENS].filter((t) => t.symbol !== 'USDC').sort((a, b) => b.change24h - a.change24h);
const gainers = movers.slice(0, 3);
const losers = movers.slice(-3).reverse();

export function Capabilities() {
  return (
    <section id="capabilities" className="section" aria-labelledby="cap-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">
            <span className="dot-label">02</span> Capabilities
          </span>
          <h2 id="cap-title">A price is a starting point. Verin shows what’s behind it.</h2>
          <p>Liquidity, cross-network context and market movement — the information that tells you how a token actually trades.</p>
        </div>

        <div className="cap">
          <article className="cap__feature">
            <div className="cap__text">
              <h3 className="cap__h">See the liquidity behind every price</h3>
              <p>
                Two tokens can show the same price and behave very differently when you trade. Verin lists every pool
                for a token and measures its depth — how much you can trade before the price moves 2%.
              </p>
              <a className="cap__link" href="#preview">
                Open AERO’s pools in the preview
              </a>
            </div>
            <figure className="cap__viz panel">
              <figcaption className="cap__vizhead">
                <span>AERO on Base · depth to move price 2%</span>
                <SampleBadge />
              </figcaption>
              <ul className="depth">
                {aeroPools.map(({ pool, pair, depth }) => (
                  <li key={pool.id} className="depth__row">
                    <div className="depth__label">
                      <span className="depth__pair">{pair}</span>
                      <span className="muted depth__type">{poolLabel(pool)}</span>
                    </div>
                    <div className="depth__bar" aria-hidden="true">
                      <span style={{ width: `${(depth / maxDepth) * 100}%` }} />
                    </div>
                    <span className="num depth__val">{formatCompactUsd(depth)}</span>
                  </li>
                ))}
              </ul>
              <p className="cap__foot muted">
                The concentrated pool holds less total liquidity but absorbs more per trade near the current price.
              </p>
            </figure>
          </article>

          <div className="cap__pair">
            <article className="cap__card panel">
              <h3 className="cap__h">One search, every network</h3>
              <p>
                The same asset trades at slightly different prices on each network, with very different costs to
                transact. Verin puts them side by side.
              </p>
              <table className="xnet">
                <caption className="visually-hidden">ETH price and network cost by network, sample data</caption>
                <thead>
                  <tr>
                    <th scope="col">Network</th>
                    <th scope="col">ETH price</th>
                    <th scope="col">vs median</th>
                    <th scope="col">Cost / hop</th>
                  </tr>
                </thead>
                <tbody>
                  {ethRows.map(({ token, gas }) => {
                    const bps = (token.priceUsd / ethMedian - 1) * 10_000;
                    return (
                      <tr key={token.id}>
                        <th scope="row">
                          <NetworkTag id={token.network} />
                        </th>
                        <td className="num">{formatPrice(token.priceUsd)}</td>
                        <td className="num">{`${bps > 0 ? '+' : bps < 0 ? '−' : ''}${Math.abs(bps).toFixed(1)} bps`}</td>
                        <td className="num">{formatUsd(gas)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="cap__foot">
                <SampleBadge />
              </p>
            </article>

            <article className="cap__card cap__card--ink">
              <h3 className="cap__h">See what’s moving — and where</h3>
              <p>
                Movers are only useful with context. Verin shows each move next to its network and the volume behind it,
                so a jump on thin volume reads differently from one on deep trading.
              </p>
              <div className="costs">
                <p className="costs__title">
                  24h movers across networks <span className="badge badge--sample">Sample data</span>
                </p>
                {[
                  ['Biggest gains', gainers],
                  ['Biggest losses', losers],
                ].map(([label, list]) => (
                  <div key={label as string} className="movers">
                    <h4 className="movers__h">{label as string}</h4>
                    <ul className="movers__list">
                      {(list as typeof movers).map((t) => (
                        <li key={t.id} className="movers__row">
                          <span className="movers__sym">
                            {t.symbol}
                            <span className="movers__net">{NETWORKS.find((n) => n.id === t.network)!.name}</span>
                          </span>
                          <span className="movers__chg">
                            <Change value={t.change24h} />
                          </span>
                          <span className="num movers__vol">{formatCompactUsd(t.volume24hUsd)} vol</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
