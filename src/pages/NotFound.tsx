import { ArrowRight } from 'lucide-react';

export function NotFound() {
  return (
    <section className="section notfound" aria-labelledby="nf-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">
            <span className="dot-label">404</span> Not found
          </span>
          <h1 id="nf-title" className="pagehead__title">
            This page doesn’t exist.
          </h1>
          <p>The address may be mistyped, or the page may have moved. These are the places most people are looking for:</p>
        </div>
        <ul className="nf__links">
          {[
            ['/#preview', 'Interactive preview', 'Search tokens and explore market data'],
            ['/solutions/', 'Solutions', 'How Verin fits your product'],
            ['/developers/', 'Developers', 'Data API status and methodology'],
            ['/contact/', 'Contact', 'Talk to the team'],
          ].map(([href, title, text]) => (
            <li key={href}>
              <a href={href} className="nf__link">
                <span>
                  <strong>{title}</strong>
                  <span className="muted"> — {text}</span>
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
