import { ArrowDownUp, ChevronDown, Info } from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';
import { RouteCard } from '../../components/RouteSummary';
import { TokenAvatar } from '../../components/TokenAvatar';
import { tokenById } from '../../data/sample';
import { dataSource } from '../../data/source';
import { formatAmount, formatUsd, parseAmount } from '../../lib/format';
import { quoteRoutes } from '../../lib/routing';
import { TokenPicker } from './TokenPicker';

const pools = dataSource.poolSnapshot();

/** Default "from" token: USDC on the same network, or ETH when the target is USDC. */
const defaultFrom = (toId: string) => {
  const to = tokenById(toId)!;
  return to.symbol === 'USDC' ? `eth-${to.network}` : `usdc-${to.network}`;
};

/**
 * Liquidity analytics: how a trade of a given size would move through the
 * token's pools. Estimates only — Verin does not execute trades.
 */
export function TradeImpact({ targetId }: { targetId: string }) {
  const target = tokenById(targetId)!;
  const [fromId, setFromId] = useState(() => defaultFrom(targetId));
  const [toId, setToId] = useState(targetId);
  const [raw, setRaw] = useState('5,000');
  const [picker, setPicker] = useState<'from' | 'to' | null>(null);
  const [computedAt, setComputedAt] = useState(() => new Date());
  const inputId = useId();
  const errId = useId();

  useEffect(() => {
    setFromId(defaultFrom(targetId));
    setToId(targetId);
  }, [targetId]);

  const from = tokenById(fromId)!;
  const to = tokenById(toId)!;
  const amount = parseAmount(raw);
  const invalid = amount !== null && (Number.isNaN(amount) || amount < 0);
  const paths = useMemo(
    () => (amount && !invalid ? quoteRoutes(pools, target.network, fromId, toId, amount) : []),
    [amount, invalid, target.network, fromId, toId],
  );
  useEffect(() => setComputedAt(new Date()), [paths]);
  const best = paths[0] ?? null;

  let status: string | null = null;
  if (amount === null || amount === 0) status = 'Enter a trade size to estimate its impact.';
  else if (!invalid && !paths.length) status = `No liquidity path between ${from.symbol} and ${to.symbol} in the sample pools.`;

  return (
    <div className="route">
      <p className="note">
        <Info size={16} aria-hidden="true" />
        Estimate how a trade of this size would move the price through {target.symbol}’s pools. Verin shows estimates
        only — it doesn’t execute trades.
      </p>

      <div className="route__box">
        <label className="route__label" htmlFor={inputId}>
          Trade size
        </label>
        <div className="route__row">
          <input
            id={inputId}
            className="route__amount num"
            inputMode="decimal"
            autoComplete="off"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            aria-invalid={invalid}
            aria-describedby={invalid ? errId : undefined}
          />
          <button type="button" className="tokenbtn" onClick={() => setPicker('from')} aria-label={`From token: ${from.symbol}. Change`}>
            <TokenAvatar token={from} size="sm" />
            {from.symbol}
            <ChevronDown size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="route__sub">
          {invalid ? (
            <span id={errId} className="route__error">
              Enter a number, e.g. 2500 or 0.75
            </span>
          ) : (
            <span className="num">{formatUsd((amount || 0) * from.priceUsd)}</span>
          )}
        </div>
      </div>

      <div className="route__flip">
        <button
          type="button"
          className="icon-btn icon-btn--sm"
          onClick={() => {
            setFromId(toId);
            setToId(fromId);
          }}
          aria-label="Swap direction of the estimate"
        >
          <ArrowDownUp size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="route__box route__box--out">
        <span className="route__label" id={`${inputId}-out`}>
          Estimated output
        </span>
        <div className="route__row">
          <output className="route__amount route__amount--out num" aria-labelledby={`${inputId}-out`}>
            {best ? formatAmount(best.amountOut) : '—'}
          </output>
          <button type="button" className="tokenbtn" onClick={() => setPicker('to')} aria-label={`Into token: ${to.symbol}. Change`}>
            <TokenAvatar token={to} size="sm" />
            {to.symbol}
            <ChevronDown size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="route__sub">
          <span className="num">{best ? formatUsd(best.amountOut * to.priceUsd) : ' '}</span>
        </div>
      </div>

      <div className="route__list">
        <div className="route__listhead">
          <h3 className="route__h">Liquidity paths{paths.length ? ` · ${paths.length}` : ''}</h3>
          <span className="route__stamp" aria-live="polite">
            {paths.length ? `Computed ${computedAt.toLocaleTimeString('en-GB')} from sample pools` : ''}
          </span>
        </div>
        {status ? (
          <p className="empty" role="status">
            {status}
          </p>
        ) : (
          <div className="route__options">
            {paths.map((r, i) => (
              <RouteCard key={r.id} route={r} best={i === 0} outSymbol={to.symbol} />
            ))}
          </div>
        )}
      </div>

      <TokenPicker
        open={picker !== null}
        network={target.network}
        exclude={picker === 'from' ? toId : fromId}
        onClose={() => setPicker(null)}
        onPick={(id) => (picker === 'from' ? setFromId(id) : setToId(id))}
      />
    </div>
  );
}
