import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Logo } from '../components/Logo';
import { NAV_PAGES, NAV_PRODUCT } from '../site';

const path = () => window.location.pathname.replace(/index\.html$/, '');
const isHome = () => path() === '/';

export function Header() {
  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [inProduct, setInProduct] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const productRef = useRef<HTMLLIElement>(null);
  const productBtnRef = useRef<HTMLButtonElement>(null);
  const home = isHome();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy (home only): mark "Product" while a product section occupies the upper viewport.
  useEffect(() => {
    if (!home) return;
    const sections = NAV_PRODUCT.map((n) => document.getElementById(n.href.split('#')[1])).filter(
      (el): el is HTMLElement => !!el,
    );
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
        setInProduct(visible.size > 0);
      },
      { rootMargin: '-30% 0px -65% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [home]);

  // Product disclosure: close on Escape, outside click, or focus leaving it.
  useEffect(() => {
    if (!productOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProductOpen(false);
        productBtnRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!productRef.current?.contains(e.target as Node)) setProductOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [productOpen]);

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 960 && setOpen(false);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = '';
    };
  }, [open]);

  const current = path();

  return (
    <header id="top" className={`header${scrolled || open ? ' is-scrolled' : ''}`}>
      <div className="container header__inner">
        <a
          href={home ? '#top' : '/'}
          className="header__brand"
          aria-label={home ? 'Verin, back to top' : 'Verin home'}
          onClick={() => setOpen(false)}
        >
          <Logo />
        </a>

        <nav className="header__nav" aria-label="Primary">
          <ul>
            <li
              ref={productRef}
              className="header__group"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setProductOpen(false);
              }}
            >
              <button
                ref={productBtnRef}
                type="button"
                className="header__link header__trigger"
                aria-expanded={productOpen}
                aria-controls="product-menu"
                aria-current={home && inProduct ? 'location' : undefined}
                onClick={() => setProductOpen((o) => !o)}
              >
                Product
                <ChevronDown size={16} aria-hidden="true" className="header__chev" />
              </button>
              <ul id="product-menu" className="header__menu panel panel--raised" hidden={!productOpen}>
                {NAV_PRODUCT.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="header__menuitem" onClick={() => setProductOpen(false)}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            {NAV_PAGES.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="header__link" aria-current={current === item.href ? 'page' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <a
            href="/contact/"
            className="header__link header__contact"
            aria-current={current === '/contact/' ? 'page' : undefined}
          >
            Contact
          </a>
          <a href="/#preview" className="btn btn--sm header__cta">
            Try the preview
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="icon-btn header__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" ref={menuRef} className="mnav" hidden={!open}>
        <nav aria-label="Primary mobile" className="container">
          <div>
            <h2 className="mnav__h">Product</h2>
            <ul className="mnav__list">
              {NAV_PRODUCT.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="mnav__link" onClick={() => setOpen(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mnav__h">Company</h2>
            <ul className="mnav__list">
              {[...NAV_PAGES, { href: '/contact/', label: 'Contact' }].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="mnav__link"
                    aria-current={current === item.href ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <a href="/#preview" className="btn btn--lg btn--block" onClick={() => setOpen(false)}>
            Try the preview
          </a>
          <p className="mnav__note">Preview build · sample data · no wallet needed</p>
        </nav>
      </div>
    </header>
  );
}
