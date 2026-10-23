# B2B readiness audit

Audit of the Verin repository (this repo is the whole product today) against what
business customers expect. "Exists" means implemented and working in this codebase.

## What Verin is today

A static marketing site with a fully interactive **preview** of a crypto market
intelligence and onchain data platform: token discovery across networks, prices,
price history, market stats, pool-level liquidity and depth, and trade-impact
estimates. All market data is sample data, computed in the browser. There is no
backend, database, authentication, data API or live data source.

**Positioning correction (latest pass):** Verin was previously presented as a
swap router. It is a market-intelligence and data platform. The routing lab,
execution review dialog, transaction-state explainer and route-led copy were
removed; trade-impact estimates remain as liquidity analytics, not execution.

## Gap checklist (prioritised by business value)

| # | Item | Before | Action taken | Still needs the team |
| --- | --- | --- | --- | --- |
| P1 | Business positioning / who it's for | Missing | Added "For teams" section on home + `/solutions/` with five segments | Validate segments with real customer conversations |
| P1 | Business inquiry path | Missing | `/contact/` form with validation, honeypot, loading/error/success states, `?type=` prefill | **Inquiry backend** (`VITE_INQUIRY_ENDPOINT`) and/or **contact email** (`VITE_CONTACT_EMAIL`). Until set, the form says nothing was sent and offers copy-to-clipboard |
| P1 | Developer entry point | Missing | `/developers/` — states plainly there is no public API/SDK/sandbox; documents how the preview computes its data, its data model and a clearly-marked proposed API scope; API-access request path | Public API, auth, keys, rate limits, SDKs, docs site, versioning policy |
| P1 | Security / reliability disclosure | Missing | `/security/` — factual current-state table (no accounts, no wallets, no custody, no tracking, no status page, no certifications claimed) | Security contact, disclosure policy, status page, monitoring, incident process, any audits — only once real |
| P1 | Legal & contact links | Missing | `/privacy/` describing this site's actual data practices; footer Company column | **Terms of service** and operator legal details (entity name, address, jurisdiction) — needs legal review; not invented |
| P2 | Use cases | Missing | Problem / how Verin helps / status / next step per segment | — |
| P2 | Pricing / commercial path | Missing | Transparent "pricing not set" block with contact path on `/solutions/` and `/contact/` | Pricing model, plans, limits, SLAs when decided |
| P1 | Data transparency | Missing | `/#data` coverage table: networks, assets, categories, history, update frequency ("not yet determined"), sources ("none connected"), limitations | Real coverage, freshness and source attribution once a provider is connected |
| P2 | Changelog / release notes | Missing | **Not added** — no release history exists to report | Start a changelog at first public release |
| P2 | Metadata & social previews | Partial (title, description) | Per-page titles/descriptions, Open Graph/Twitter tags, `og-image.png` | Set `VITE_SITE_URL` so share images resolve to an absolute URL |
| P2 | Not-found page | Missing | `404.html` | Host must serve `404.html` for unknown paths |
| P3 | Dashboard, orgs, teams, API keys, usage, billing | Missing | **Not built** — there are no accounts or API to manage; a UI would be a simulation | Requires auth + backend first |
| — | Cookie consent | Not required today | None added: no cookies, analytics or tracking in this build | Re-assess if analytics or third-party tags are added |
| — | Self-hosted fonts | Fonts load from Google Fonts | Disclosed in privacy notice | Consider self-hosting to avoid sending visitor IPs to Google |

## Integration boundaries

- **Inquiries:** `src/site.ts` reads `VITE_INQUIRY_ENDPOINT`. The form `POST`s JSON
  (`name, email, company, role, website, type, useCase, message, requirements, page, submittedAt`)
  and treats only a 2xx response as delivered. The endpoint must validate input
  server-side, rate-limit, and store or forward to the CRM. No secrets belong in
  the frontend.
- **Market data:** `src/data/source.ts` (`MarketDataSource`), unchanged.
