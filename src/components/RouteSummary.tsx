import { AlertTriangle, ChevronRight } from 'lucide-react';
import { poolLabel, tokenById } from '../data/sample';
import { formatAmount, formatRatio, formatUsd } from '../lib/format';
import type { Leg, Route } from '../lib/routing';

/** Token → pool → token path for a single leg. */
export function LegPath({ leg }: { leg: Leg }) {
  return (
    <ol className="legpath" aria-label="Liquidity path">
      {leg.hops.map((hop, i) => (
        <li key={hop.pool.id} className="legpath__step">
          {i === 0 && <span className="legpath__token">{tokenById(hop.tokenIn)!.symbol}</span>}
          <ChevronRight size={14} aria-hidden="true" className="legpath__arrow" />
          <span className="legpath__pool">{poolLabel(hop.pool)}</span>
          <ChevronRight size={14} aria-hidden="true" className="legpath__arrow" />
          <span className="legpath__token">{tokenById(hop.tokenOut)!.symbol}</span>
        </li>
      ))}
    </ol>
  );
}

export const impactLevel = (impact: number) => (impact >= 0.05 ? 'high' : impact >= 0.01 ? 'medium' : 'low');

export function ImpactValue({ impact }: { impact: number }) {
  const level = impactLevel(impact);
  return (
    <span className={`impact impact--${level}`}>
      {level !== 'low' && <AlertTriangle size={14} aria-hidden="true" />}
      <span className="num">{formatRatio(impact)}</span>
      {level !== 'low' && <span className="visually-hidden"> ({level} price impact)</span>}
    </span>
  );
}

interface RouteCardProps {
  route: Route;
  best: boolean;
  outSymbol: string;
}

/** One liquidity path (or split across paths) with its estimated output and costs. */
export function RouteCard({ route, best, outSymbol }: RouteCardProps) {
  return (
    <div className="routecard">
      <div className="routecard__head">
        <span className="routecard__out">
          <span className="num">{formatAmount(route.amountOut)}</span> {outSymbol}
        </span>
        <span className="routecard__tags">
          {best && <span className="badge badge--brand">Lowest cost</span>}
          <span className="badge">{route.kind === 'split' ? `Split · ${route.legs.length} paths` : `${route.hopCount} hop${route.hopCount > 1 ? 's' : ''}`}</span>
        </span>
      </div>
      <div className="routecard__legs">
        {route.legs.map((leg) => (
          <div key={leg.hops.map((h) => h.pool.id).join()} className="routecard__leg">
            {route.legs.length > 1 && <span className="routecard__share num">{Math.round(leg.share * 100)}%</span>}
            <LegPath leg={leg} />
          </div>
        ))}
      </div>
      <dl className="routecard__meta">
        <div>
          <dt>Impact</dt>
          <dd>
            <ImpactValue impact={route.priceImpact} />
          </dd>
        </div>
        <div>
          <dt>LP fees</dt>
          <dd className="num">{formatUsd(route.lpFeesUsd)}</dd>
        </div>
        <div>
          <dt>Network</dt>
          <dd className="num">{formatUsd(route.networkCostUsd)}</dd>
        </div>
      </dl>
    </div>
  );
}
