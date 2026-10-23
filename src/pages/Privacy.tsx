import { PageHead } from './PageHead';

export function Privacy() {
  return (
    <>
      <PageHead eyebrow="Privacy" title="Privacy notice.">
        <p>How this website handles personal information. It describes the site as it currently works.</p>
      </PageHead>
      <section className="section section--tight">
        <div className="container">
          <div className="prose">
            <p className="prose__note">
              This notice will be expanded with the operating company’s legal details (name, registered address and
              contact) before Verin launches publicly. Until then, use the <a href="/contact/">contact form</a> for
              privacy questions.
            </p>

            <h2>What we collect</h2>
            <p>
              Browsing this site does not create an account and the site itself sets no cookies, uses no analytics and
              stores nothing in your browser.
            </p>
            <p>
              If you submit the <a href="/contact/">contact form</a>, we receive what you enter: name, work email,
              company, role, optional website, inquiry type, use case and your message, plus the page you sent it from
              and the time.
            </p>

            <h2>How we use it</h2>
            <p>
              Only to reply to your inquiry and to keep a record of the conversation. We don’t sell it or use it for
              advertising.
            </p>

            <h2>Third parties</h2>
            <p>
              Typefaces are served by Google Fonts. Loading them sends your IP address and browser information to
              Google, under Google’s own privacy policy. No other third-party services run on this site.
            </p>

            <h2>Wallets and onchain data</h2>
            <p>
              The site never connects to a wallet or reads your onchain activity. Market data shown is sample data.
            </p>

            <h2>Your choices</h2>
            <p>
              You can ask us what inquiry information we hold about you, or ask us to delete it, through the{' '}
              <a href="/contact/">contact form</a>.
            </p>

            <h2>Changes</h2>
            <p>When the site’s data practices change — for example when accounts or analytics are added — this notice will be updated first.</p>
          </div>
        </div>
      </section>
    </>
  );
}
