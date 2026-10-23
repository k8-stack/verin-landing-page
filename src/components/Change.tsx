import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { formatPct, trend } from '../lib/format';

/** Percent change with direction conveyed by icon, sign and text — not colour alone. */
export function Change({ value, size = 14 }: { value: number; size?: number }) {
  const dir = trend(value);
  const Icon = dir === 'up' ? ArrowUpRight : dir === 'down' ? ArrowDownRight : Minus;
  return (
    <span className={`change change--${dir}`}>
      <Icon size={size} strokeWidth={2.25} aria-hidden="true" />
      <span>{formatPct(value)}</span>
      <span className="visually-hidden">{dir === 'up' ? ' up' : dir === 'down' ? ' down' : ' unchanged'}</span>
    </span>
  );
}
