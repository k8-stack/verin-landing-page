import { ArrowRight, Check } from 'lucide-react';
import { USE_CASES } from '../content/useCases';
import { contactHref } from '../site';
import { PageHead } from './PageHead';

const ADOPTION = [
  ['Explore the preview', 'Search tokens, read market stats and inspect pools with sample data. No account needed.'],
  ['Tell us your requirements', 'Networks, assets, data categories, history depth, request volume and freshness.'],
  ['Scope it together', 'We confirm which data Verin can provide for your case and what is still on the roadmap.'],
  ['Integrate when it’s ready', 'Integration access is arranged directly with the team; there is no self-serve sign-up yet.'],
] as const;

export function Solutions() {
  return (
    <>
      <PageHead eyebrow="Solutions" title="Where Verin fits in your product.">
        <p>
          Verin is a crypto market intelligence and onchain data platform: token discovery, prices, history and
          pool-level liquidity across networks. Below is how that maps to five kinds of teams, and what you can evaluate
          today.
        </p>
      </PageHead>

      <section className="section section--tight" aria-label="Use cases">
        <div className="container">
          <ol className="usecases">
            {USE_CASES.map((u, i) => (
              <li key={u.id} id={u.id} className="usecase">
                <div className="usecase__intro">
                  <span className="dot-label usecase__n" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <h2 className="usecase__h">{u.segment}</h2>
                  <p className="muted">{u.problem}</p>
                </div>
                <div className="usecase__body">
                  <h3 className="usecase__sub">What Verin does for this</h3>
                  <ul className="usecase__list">
                    {u.helps.map((h) => (
                      <li key={h}>
                        <Check size={18} aria-hidden="true" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <p className="usecase__status">
                    <span className="badge badge--sample">Preview</span> Working in the preview on sample data. Not yet
                    available as a hosted service.
                  </p>
                  <div className="usecase__links">
                    <a href={contactHref(u.next.type)} className="btn btn--sm">
                      {u.next.label}
                    </a>
                    <a href={u.seeIt.href} className="teams__link">
                      {u.seeIt.label} <ArrowRight size={16} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--subtle" aria-labelledby="adopt-title">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Adoption</span>
            <h2 id="adopt-title">How working with Verin starts.</h2>
          </div>
          <ol className="states__list adopt">
            {ADOPTION.map(([t, d], i) => (
              <li key={t} className="states__item">
                <span className="dot-label adopt__n">0{i + 1}</span>
                <span className="states__name">{t}</span>
                <span className="muted states__text">{d}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="pricing" className="section" aria-labelledby="pricing-title">
        <div className="container">
          <div className="pricing panel">
            <div className="pricing__text">
              <span className="eyebrow">Pricing</span>
              <h2 id="pricing-title" className="pricing__h">
                No public pricing yet.
              </h2>
              <p className="muted">
                Verin is in preview and commercial terms aren’t set. Rather than publish placeholder plans, we price
                with early customers based on what they actually need: networks, data categories, history depth
                and request volume. There are no published service levels or support commitments yet.
              </p>
            </div>
            <div className="pricing__cta">
              <a href={contactHref('commercial')} className="btn btn--lg">
                Discuss your requirements <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a href="/developers/" className="btn btn--lg btn--secondary">
                Developer overview
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
