import { ArrowRight } from 'lucide-react';
import { contactHref } from '../site';
import { PageHead } from './PageHead';

/* Every row describes this build as it is. Update when the product changes — never ahead of it. */
const ROWS = [
  ['Accounts & sign-in', 'There are no accounts. The site has no sign-in and stores no user profiles.'],
  ['Wallets & funds', 'The site never connects to a wallet, requests a signature or holds funds. Verin is a data product; it does not execute trades.'],
  ['Market data', 'All prices, pools and histories are sample data, labelled on every surface. Liquidity and trade-impact calculations run in your browser.'],
  ['Cookies & tracking', 'No cookies, analytics, advertising tags or browser storage are used.'],
  ['Third parties', 'Fonts are loaded from Google Fonts, which receives your IP address and browser details when the page loads.'],
  ['Inquiry form', 'Details you enter are sent only when you submit, and only if an inquiry service is configured. The form tells you plainly if nothing was sent.'],
  ['Availability & status', 'There is no status page, uptime monitoring figure or service-level agreement yet.'],
  ['Certifications & audits', 'Verin holds no security certifications and has not published third-party audits. We don’t claim otherwise.'],
  ['API limits & versioning', 'Not applicable yet — there is no public API.'],
] as const;

export function Security() {
  return (
    <>
      <PageHead eyebrow="Security & data" title="What Verin does with your data — today.">
        <p>
          A plain account of the current preview build. If something here changes, this page changes with it. We would
          rather list a gap than imply an assurance we can’t back.
        </p>
      </PageHead>

      <section className="section section--tight" aria-labelledby="sec-current">
        <div className="container">
          <h2 id="sec-current" className="visually-hidden">
            Current state
          </h2>
          <dl className="router sec">
            {ROWS.map(([k, v]) => (
              <div key={k} className="router__row">
                <dt>{k}</dt>
                <dd className="muted">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section--subtle" aria-labelledby="sec-report">
        <div className="container">
          <div className="pricing panel">
            <div className="pricing__text">
              <span className="eyebrow">Report an issue</span>
              <h2 id="sec-report" className="pricing__h">
                Found a security problem?
              </h2>
              <p className="muted">
                Send it through the contact form with “Security question or report” selected. Include what you found
                and how to reproduce it; please don’t include exploit code or any personal data. A formal disclosure
                policy has not been published yet.
              </p>
            </div>
            <div className="pricing__cta">
              <a href={contactHref('security')} className="btn btn--lg">
                Report a security issue <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a href="/privacy/" className="btn btn--lg btn--secondary">
                Privacy notice
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
