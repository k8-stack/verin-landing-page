import type { ReactNode } from 'react';
import { Footer } from '../sections/Footer';
import { Header } from '../sections/Header';

/** Shared page shell: skip link, header, main landmark, footer. */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
