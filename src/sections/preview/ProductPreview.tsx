import { useRef, useState } from 'react';
import { SampleBadge } from '../../components/SampleBadge';
import { NETWORKS, TOKENS, tokenById } from '../../data/sample';
import { dataSource } from '../../data/source';
import type { NetworkId } from '../../data/types';
import { formatUtcStamp } from '../../lib/format';
import { useAsync } from '../../lib/useAsync';
import { TokenDetail, type DetailTab } from './TokenDetail';
import { TokenList, type SortState, type View } from './TokenList';
import './preview.css';

const initialNetwork = (): NetworkId | 'all' => {
  const fromUrl = new URLSearchParams(window.location.search).get('network');
  return NETWORKS.find((n) => n.id === fromUrl)?.id ?? 'all';
};

/** Deep links: ?token=<id> opens that token; ?network=<id> opens that network's most-traded token. */
const initialToken = () => {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('token');
  if (fromUrl && tokenById(fromUrl)) return fromUrl;
  const net = initialNetwork();
  if (net === 'all' || net === 'base') return 'aero-base';
  return [...TOKENS].filter((t) => t.network === net && t.symbol !== 'USDC').sort((a, b) => b.volume24hUsd - a.volume24hUsd)[0].id;
};

export function ProductPreview() {
  const tokens = useAsync(() => dataSource.listTokens(), []);
  const [query, setQuery] = useState('');
  const [network, setNetwork] = useState<NetworkId | 'all'>(initialNetwork);
  const [view, setView] = useState<View>('all');
  const [sort, setSort] = useState<SortState>({ key: 'volume', dir: 'desc' });
  const [selectedId, setSelectedId] = useState(initialToken);
  const [tab, setTab] = useState<DetailTab>('overview');
  const detailRef = useRef<HTMLDivElement>(null);

  const select = (id: string) => {
    setSelectedId(id);
    if (window.matchMedia('(max-width: 63.99rem)').matches) {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const changeView = (v: View) => {
    setView(v);
    setSort(v === 'losers' ? { key: 'change', dir: 'asc' } : v === 'gainers' ? { key: 'change', dir: 'desc' } : { key: 'volume', dir: 'desc' });
  };

  return (
    <section id="preview" className="section section--subtle" aria-labelledby="preview-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">
            <span className="dot-label">01</span> Interactive preview
          </span>
          <h2 id="preview-title">Find a market, then look underneath it.</h2>
          <p>
            Filter tokens across four networks, open one to see its price history, market stats and the pools that hold
            its liquidity — then estimate how a trade would move its price. Everything below works; the numbers are
            sample data.
          </p>
        </div>

        <div className="app panel panel--raised">
          <div className="app__bar">
            <span className="app__title">Markets</span>
            <span className="app__meta">
              <SampleBadge />
              <span className="app__stamp">Snapshot {formatUtcStamp(dataSource.info.asOf)}</span>
            </span>
          </div>
          <div className="app__body">
            <TokenList
              tokens={tokens}
              query={query}
              onQuery={setQuery}
              network={network}
              onNetwork={setNetwork}
              view={view}
              onView={changeView}
              sort={sort}
              onSort={setSort}
              selectedId={selectedId}
              onSelect={select}
            />
            <div className="app__detail" ref={detailRef} aria-label="Token detail" role="region">
              <TokenDetail id={selectedId} tab={tab} onTab={setTab} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
