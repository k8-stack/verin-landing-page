/*
 * Site-wide navigation and business configuration.
 * Integration settings come from build-time env vars (see .env.example).
 * Nothing here is secret: an inquiry endpoint is a public URL by design.
 */

/** Sections of the landing page. Absolute ("/#…") so they work from every page. */
export const NAV_PRODUCT = [
  { href: '/#preview', label: 'Interactive preview' },
  { href: '/#capabilities', label: 'Capabilities' },
  { href: '/#how', label: 'How it works' },
  { href: '/#transparency', label: 'Data & transparency' },
  { href: '/#data', label: 'Data coverage' },
] as const;

export const NAV_PAGES = [
  { href: '/solutions/', label: 'Solutions' },
  { href: '/developers/', label: 'Developers' },
  { href: '/security/', label: 'Security' },
] as const;

export const NAV_COMPANY = [
  { href: '/contact/', label: 'Contact' },
  { href: '/security/', label: 'Security & data' },
  { href: '/privacy/', label: 'Privacy' },
] as const;

const env = import.meta.env;

export const INQUIRY_ENDPOINT: string = (env.VITE_INQUIRY_ENDPOINT ?? '').trim();
export const CONTACT_EMAIL: string = (env.VITE_CONTACT_EMAIL ?? '').trim();

export const INQUIRY_TYPES = [
  { id: 'integration', label: 'Integrate Verin data into a product' },
  { id: 'api', label: 'Data API access' },
  { id: 'partnership', label: 'Partnership' },
  { id: 'commercial', label: 'Pricing and commercial terms' },
  { id: 'security', label: 'Security question or report' },
  { id: 'other', label: 'Something else' },
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number]['id'];

export const USE_CASES = [
  { id: 'wallet', label: 'Wallet or consumer crypto app' },
  { id: 'trading', label: 'Trading platform or terminal' },
  { id: 'data', label: 'Analytics, research or data product' },
  { id: 'protocol', label: 'DeFi protocol or token team' },
  { id: 'developer', label: 'Developer building a market-data app' },
  { id: 'other', label: 'Other' },
] as const;

export const contactHref = (type?: InquiryType) => (type ? `/contact/?type=${type}` : '/contact/');
