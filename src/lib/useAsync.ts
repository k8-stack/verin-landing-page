import { useEffect, useState } from 'react';

/**
 * Minimal async loader: re-runs when deps change. Returns null while pending,
 * or the previous value when `keepPrevious` is set (avoids flashes and focus loss).
 */
export function useAsync<T>(load: () => Promise<T>, deps: unknown[], keepPrevious = false): T | null {
  const [value, setValue] = useState<T | null>(null);
  useEffect(() => {
    let live = true;
    if (!keepPrevious) setValue(null);
    load().then((v) => live && setValue(v));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return value;
}
