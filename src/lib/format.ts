const MINUS = '−';

const compactUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});

const usd2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** $1.84B, $96M, $14.2K — for market cap, volume, liquidity. */
export const formatCompactUsd = (v: number) => compactUsd.format(v);

/** Exact dollars with cents: $1,234.56. Values below a cent show as "< $0.01". */
export const formatUsd = (v: number) => (v > 0 && v < 0.01 ? '< $0.01' : usd2.format(v));

/** Token price with precision that scales with magnitude. */
export function formatPrice(p: number) {
  if (p >= 1000) return usd2.format(p);
  if (p >= 1) return `$${p.toLocaleString('en-US', { minimumSignificantDigits: 3, maximumSignificantDigits: 5 })}`;
  return `$${p.toLocaleString('en-US', { maximumSignificantDigits: 4, maximumFractionDigits: 12 })}`;
}

/** Token amounts: up to 6 significant digits, grouped. */
export function formatAmount(v: number) {
  if (v === 0) return '0';
  if (v >= 100_000) return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (v >= 1) return v.toLocaleString('en-US', { maximumFractionDigits: v >= 1000 ? 2 : 4 });
  return v.toLocaleString('en-US', { maximumSignificantDigits: 6, maximumFractionDigits: 12 });
}

/** +6.42% / −4.18% with a true minus sign. */
export function formatPct(v: number, digits = 2) {
  const abs = Math.abs(v).toFixed(digits);
  if (Number(abs) === 0) return `${(0).toFixed(digits)}%`;
  return `${v > 0 ? '+' : MINUS}${abs}%`;
}

/** Fraction (0..1) to a percentage string without a sign. */
export const formatRatio = (v: number, digits = 2) => (v > 0 && v < 10 ** -digits / 100 ? `< ${(10 ** -digits).toFixed(digits)}%` : `${(v * 100).toFixed(digits)}%`);

export const trend = (v: number): 'up' | 'down' | 'flat' => (Math.abs(v) < 0.005 ? 'flat' : v > 0 ? 'up' : 'down');

const utcTime = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
const utcDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const utcDayTime = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
const utcDay = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

export const formatUtcTime = (t: number) => `${utcTime.format(t)} UTC`;
export const formatUtcDate = (t: number) => utcDate.format(t);
export const formatUtcStamp = (t: number) => `${utcDate.format(t)}, ${utcTime.format(t)} UTC`;
export const formatUtcDayTime = (t: number) => `${utcDayTime.format(t)} UTC`;
export const formatUtcDay = (t: number) => utcDay.format(t);

/** Parse user-entered amounts: accepts "1,000.5", rejects anything else. */
export function parseAmount(raw: string): number | null {
  const clean = raw.replace(/,/g, '').trim();
  if (!clean) return null;
  if (!/^\d*\.?\d*$/.test(clean) || clean === '.') return NaN;
  return Number(clean);
}
