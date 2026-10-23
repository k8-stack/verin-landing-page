import { Logo } from '../components/Logo';
import { NETWORKS } from '../data/sample';
import { NAV_COMPANY, NAV_PAGES, NAV_PRODUCT } from '../site';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo />
            <p className="muted">Crypto market intelligence and onchain data. Currently a preview build running on sample data.</p>
          </div>
          <nav aria-label="Product" className="footer__col">
            <h2 className="footer__h">Product</h2>
            <ul>
              {NAV_PRODUCT.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Company" className="footer__col">
            <h2 className="footer__h">Company</h2>
            <ul>
              {[...NAV_PAGES.filter((n) => n.href !== '/security/'), ...NAV_COMPANY].map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Networks" className="footer__col">
            <h2 className="footer__h">Networks in preview</h2>
            <ul>
              {NETWORKS.map((n) => (
                <li key={n.id}>
                  <a href={`/?network=${n.id}#preview`}>{n.name}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer__col">
            <h2 className="footer__h">Status</h2>
            <ul className="footer__status">
              <li>Data: sample, not live</li>
              <li>Data API: not available</li>
              <li>Accounts: none</li>
            </ul>
          </div>
        </div>
        <div className="footer__base">
          <p>© {new Date().getFullYear()} Verin</p>
          <p>Independent product. Not affiliated with or endorsed by Base or Coinbase.</p>
        </div>
      </div>
    </footer>
  );
}
