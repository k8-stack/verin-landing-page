import { ArrowRight } from 'lucide-react';
import { USE_CASES } from '../content/useCases';

/** Compact business entry point on the landing page; detail lives on /solutions/. */
export function ForTeams() {
  return (
    <section id="teams" className="section" aria-labelledby="teams-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">
            <span className="dot-label">05</span> For teams
          </span>
          <h2 id="teams-title">Building with crypto market data? Verin can sit underneath it.</h2>
          <p>
            The preview shows the experience. If you run a wallet, trading platform, analytics product or protocol, tell
            us what data you would integrate — it shapes what we ship first.
          </p>
        </div>

        <ul className="teams">
          {USE_CASES.map((u) => (
            <li key={u.id} className="teams__item">
              <h3 className="teams__h">{u.segment}</h3>
              <p className="muted">{u.summary}</p>
              <a href={`/solutions/#${u.id}`} className="teams__link">
                How it fits <ArrowRight size={16} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        <div className="teams__cta">
          <a href="/contact/?type=integration" className="btn btn--lg">
            Talk to our team <ArrowRight size={18} aria-hidden="true" />
          </a>
          <a href="/developers/" className="btn btn--lg btn--secondary">
            Developer overview
          </a>
        </div>
      </div>
    </section>
  );
}
