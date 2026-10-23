import type { Token } from '../data/types';

type Size = 'sm' | 'md' | 'lg';

/** Monogram avatar. Real token logos are intentionally not bundled. */
export function TokenAvatar({ token, size = 'md' }: { token: Pick<Token, 'symbol' | 'tone'>; size?: Size }) {
  const letters = token.symbol.replace(/^cb/, '').slice(0, size === 'sm' ? 1 : 2);
  return (
    <span className={`avatar${size === 'md' ? '' : ` avatar--${size}`}`} data-tone={token.tone} aria-hidden="true">
      {letters}
    </span>
  );
}
