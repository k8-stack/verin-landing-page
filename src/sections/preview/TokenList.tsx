import { ArrowDown, ArrowUp, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { Change } from '../../components/Change';
import { NetworkTag } from '../../components/NetworkTag';
import { TokenAvatar } from '../../components/TokenAvatar';
import { NETWORKS } from '../../data/sample';
import type { NetworkId, Token } from '../../data/types';
import { formatCompactUsd, formatPrice } from '../../lib/format';
import { liquidityFor } from '../../lib/market';

export type View = 'all' | 'gainers' | 'losers';
export type SortKey = 'price' | 'change' | 'volume' | 'liquidity';
export interface SortState {
  key: SortKey;
  dir: 'asc' | 'desc';
}

const VIEWS: { id: View; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'gainers', label: 'Gainers' },
  { id: 'losers', label: 'Losers' },
];

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'price', label: 'Price' },
  { key: 'change', label: '24h' },
  { key: 'volume', label: 'Volume' },
  { key: 'liquidity', label: 'Liquidity' },
];

const metric = (t: Token, key: SortKey) =>
  key === 'price' ? t.priceUsd : key === 'change' ? t.change24h : key === 'volume' ? t.volume24hUsd : liquidityFor(t.id);

interface TokenListProps {
  tokens: Token[] | null;
  query: string;
  onQuery: (q: string) => void;
  network: NetworkId | 'all';
  onNetwork: (n: NetworkId | 'all') => void;
  view: View;
  onView: (v: View) => void;
  sort: SortState;
  onSort: (s: SortState) => void;
  selectedId: string;
  onSelect: (id: string) => void;
}

export function TokenList(props: TokenListProps) {
  const { tokens, query, onQuery, network, onNetwork, view, onView, sort, onSort, selectedId, onSelect } = props;
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" focuses search, matching common market-terminal convention.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== '/' || t.closest('input, textarea, select, [contenteditable], dialog')) return;
      // Only while the preview section is on screen, so "/" elsewhere on the page isn't hijacked.
      const section = searchRef.current?.closest('section')?.getBoundingClientRect();
      if (!section || section.bottom < 0 || section.top > window.innerHeight) return;
      e.preventDefault();
      searchRef.current?.focus({ preventScroll: true });
      searchRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const rows = useMemo(() => {
    if (!tokens) return null;
    const needle = query.trim().toLowerCase();
    const list = tokens.filter(
      (t) =>
        (network === 'all' || t.network === network) &&
        (view === 'all' || (view === 'gainers' ? t.change24h > 0.005 : t.change24h < -0.005)) &&
        (!needle || t.symbol.toLowerCase().includes(needle) || t.name.toLowerCase().includes(needle)),
    );
    const sign = sort.dir === 'asc' ? 1 : -1;
    return list.sort((a, b) => sign * (metric(a, sort.key) - metric(b, sort.key)));
  }, [tokens, query, network, view, sort]);

  const filtered = query || network !== 'all' || view !== 'all';
  const sortLabel = `${COLUMNS.find((c) => c.key === sort.key)!.label}, ${sort.dir === 'desc' ? 'high to low' : 'low to high'}`;

  const toggleSort = (key: SortKey) =>
    onSort(sort.key === key ? { key, dir: sort.dir === 'desc' ? 'asc' : 'desc' } : { key, dir: 'desc' });

  return (
    <div className="tlist">
      <div className="tlist__controls">
        <label className="tlist__search">
          <span className="visually-hidden">Search tokens</span>
          <span className="input-wrap">
            <Search size={18} aria-hidden="true" />
            <input
              ref={searchRef}
              className="input"
              type="search"
              placeholder="Search token or name"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            {!query && <kbd className="kbd" aria-hidden="true">/</kbd>}
          </span>
        </label>
        <div className="chip-row" role="group" aria-label="Filter by network">
          <button type="button" className="chip" aria-pressed={network === 'all'} onClick={() => onNetwork('all')}>
            All networks
          </button>
          {NETWORKS.map((n) => (
            <button key={n.id} type="button" className="chip" aria-pressed={network === n.id} onClick={() => onNetwork(n.id)}>
              {n.name}
            </button>
          ))}
        </div>
        <div className="tlist__row2">
          <div role="group" aria-label="Market view" className="seg">
            {VIEWS.map((v) => (
              <button key={v.id} type="button" className="seg__btn" aria-pressed={view === v.id} onClick={() => onView(v.id)}>
                {v.label}
              </button>
            ))}
          </div>
          <label className="tlist__sortsel">
            <span className="visually-hidden">Sort by</span>
            <select
              className="input"
              value={`${sort.key}:${sort.dir}`}
              onChange={(e) => {
                const [key, dir] = e.target.value.split(':') as [SortKey, 'asc' | 'desc'];
                onSort({ key, dir });
              }}
            >
              {COLUMNS.flatMap((c) => [
                <option key={`${c.key}:desc`} value={`${c.key}:desc`}>
                  {c.label} ↓
                </option>,
                <option key={`${c.key}:asc`} value={`${c.key}:asc`}>
                  {c.label} ↑
                </option>,
              ])}
            </select>
          </label>
        </div>
      </div>

      <div className="tlist__head" aria-hidden={false}>
        <span className="tlist__hcell tlist__hcell--token">Token</span>
        {COLUMNS.map((c) => (
          <button
            key={c.key}
            type="button"
            className={`tlist__hcell tlist__sort tlist__col--${c.key}${sort.key === c.key ? ' is-active' : ''}`}
            onClick={() => toggleSort(c.key)}
            aria-label={`Sort by ${c.label}${sort.key === c.key ? `, currently ${sort.dir === 'desc' ? 'high to low' : 'low to high'}` : ''}`}
          >
            {c.label}
            {sort.key === c.key &&
              (sort.dir === 'desc' ? <ArrowDown size={14} aria-hidden="true" /> : <ArrowUp size={14} aria-hidden="true" />)}
          </button>
        ))}
      </div>

      <p className="visually-hidden" role="status">
        {rows ? `${rows.length} tokens, sorted by ${sortLabel}` : 'Loading tokens'}
      </p>

      <ul className="tlist__rows" aria-label="Tokens">
        {!rows &&
          Array.from({ length: 7 }, (_, i) => (
            <li key={i} className="tlist__skel" aria-hidden="true">
              <span className="skeleton" />
            </li>
          ))}
        {rows?.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              className="trow"
              aria-pressed={t.id === selectedId}
              onClick={() => onSelect(t.id)}
            >
              <span className="trow__token">
                <TokenAvatar token={t} />
                <span className="trow__names">
                  <span className="trow__sym">{t.symbol}</span>
                  <span className="trow__meta">
                    <span className="trow__name">{t.name}</span>
                    <NetworkTag id={t.network} />
                  </span>
                </span>
              </span>
              <span className="trow__cell tlist__col--price num">{formatPrice(t.priceUsd)}</span>
              <span className="trow__cell tlist__col--change">
                <Change value={t.change24h} />
              </span>
              <span className="trow__cell tlist__col--volume num">{formatCompactUsd(t.volume24hUsd)}</span>
              <span className="trow__cell tlist__col--liquidity num">{formatCompactUsd(liquidityFor(t.id))}</span>
            </button>
          </li>
        ))}
      </ul>

      {rows && !rows.length && (
        <div className="empty empty--block">
          <p>No tokens match these filters.</p>
          {filtered && (
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => {
                onQuery('');
                onNetwork('all');
                onView('all');
              }}
            >
              <X size={16} aria-hidden="true" /> Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
