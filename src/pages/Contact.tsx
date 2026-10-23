import { CONTACT_EMAIL } from '../site';
import { InquiryForm } from './InquiryForm';
import { PageHead } from './PageHead';

export function Contact() {
  return (
    <>
      <PageHead eyebrow="Contact" title="Talk to the Verin team.">
        <p>Integrations, data access, partnerships or commercial questions — one form reaches the people building Verin.</p>
      </PageHead>

      <section className="section section--tight" aria-label="Inquiry">
        <div className="container contact">
          <div className="panel contact__form">
            <InquiryForm />
          </div>
          <aside className="contact__aside" aria-label="Before you write">
            <div>
              <h2 className="contact__h">Pricing</h2>
              <p className="muted">
                Not published yet. Tell us your networks and expected volume and we’ll discuss terms that fit.{' '}
                <a href="/solutions/#pricing">Why there’s no price list</a>
              </p>
            </div>
            <div>
              <h2 className="contact__h">API access</h2>
              <p className="muted">
                There’s no public API yet. The <a href="/developers/">developer overview</a> explains what exists and
                what we need to know.
              </p>
            </div>
            <div>
              <h2 className="contact__h">Security reports</h2>
              <p className="muted">
                Choose “Security question or report”. See <a href="/security/">security &amp; data</a> for how the site
                handles information.
              </p>
            </div>
            {CONTACT_EMAIL && (
              <div>
                <h2 className="contact__h">Email</h2>
                <p>
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
