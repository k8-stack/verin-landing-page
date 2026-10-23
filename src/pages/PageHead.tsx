import type { ReactNode } from 'react';

/** Page-level heading block; same rhythm as landing-page section heads, with an h1. */
export function PageHead({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <header className="pagehead">
      <div className="container">
        <div className="section-head pagehead__inner">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="pagehead__title">{title}</h1>
          {children && <div className="pagehead__lead">{children}</div>}
        </div>
      </div>
    </header>
  );
}
