import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Dialog } from '../../components/Dialog';
import { NetworkTag } from '../../components/NetworkTag';
import { TokenAvatar } from '../../components/TokenAvatar';
import { networkById, TOKENS } from '../../data/sample';
import type { NetworkId } from '../../data/types';
import { formatPrice } from '../../lib/format';

interface TokenPickerProps {
  open: boolean;
  network: NetworkId;
  exclude?: string;
  onPick: (id: string) => void;
  onClose: () => void;
}

export function TokenPicker({ open, network, exclude, onPick, onClose }: TokenPickerProps) {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return TOKENS.filter(
      (t) =>
        t.network === network &&
        (!needle || t.symbol.toLowerCase().includes(needle) || t.name.toLowerCase().includes(needle)),
    );
  }, [q, network]);

  const close = () => {
    setQ('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={close} title="Select a token">
      <div className="picker">
        <label className="field">
          <span className="visually-hidden">Search tokens on {networkById(network).name}</span>
          <span className="input-wrap">
            <Search size={18} aria-hidden="true" />
            <input
              className="input"
              type="search"
              placeholder="Search by name or symbol"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
          </span>
        </label>
        <p className="note">
          Estimates in this preview stay on one network: <NetworkTag id={network} />
        </p>
        {results.length ? (
          <ul className="picker__list" aria-label="Tokens">
            {results.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className="picker__item"
                  disabled={t.id === exclude}
                  onClick={() => {
                    onPick(t.id);
                    close();
                  }}
                >
                  <TokenAvatar token={t} />
                  <span className="picker__names">
                    <span className="picker__sym">{t.symbol}</span>
                    <span className="picker__name">{t.name}</span>
                  </span>
                  <span className="num picker__price">{t.id === exclude ? 'Selected' : formatPrice(t.priceUsd)}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty" role="status">
            No tokens match “{q}” on {networkById(network).name}.
          </p>
        )}
      </div>
    </Dialog>
  );
}
