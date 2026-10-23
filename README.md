# Verin — landing page

Landing page, interactive preview and business pages for Verin, a crypto market
intelligence and onchain data platform. Built with Vite, React 19 and TypeScript; styling is plain
CSS on design tokens (see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)).

```bash
npm install
npm run dev          # local dev server
npm run build        # type-check + production build
npm run audit:fonts  # fails if any font size can render below 12px
node scripts/gen-html.mjs  # regenerate page HTML (titles, descriptions, share tags)
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page and interactive preview |
| `/solutions/` | Use cases by customer segment, adoption steps, pricing status |
| `/developers/` | Data API status, methodology, data model, proposed API scope, API-access request |
| `/security/` | Current-state security, data and reliability disclosure |
| `/contact/` | Business inquiry form (`?type=` prefills: integration, api, partnership, commercial, security, other) |
| `/privacy/` | Privacy notice for this site |
| `404.html` | Not-found page (configure your host to serve it) |

It's a Vite multi-page build: every route is static HTML, so no server rewrites are needed.

## Configuration

Copy `.env.example` to `.env.local`:

- `VITE_INQUIRY_ENDPOINT` — HTTPS endpoint that receives inquiry JSON by `POST`. Only a 2xx response is shown as delivered. **Unset by default:** the form says up front that it can't send, and offers copy (and email, if configured).
- `VITE_CONTACT_EMAIL` — optional public inbox shown as a fallback.
- `VITE_SITE_URL` — absolute origin, so `og:image` resolves for link previews.

See `docs/B2B_READINESS.md` for the audit and what still needs backend or business input.

## Structure

```
src/
  data/
    types.ts         domain types (Token, Pool, Network…)
    sample.ts        SAMPLE data: tokens, pools, deterministic price histories
    source.ts        MarketDataSource interface + sampleSource adapter
  lib/
    routing.ts       liquidity analytics: pool depth, trade-impact estimates per path
    format.ts        price / amount / percent / time formatting
    market.ts, useAsync.ts, useElementWidth.ts
  components/        Dialog, Tabs, PriceChart, RouteSummary, TokenAvatar…
  sections/          Header, Hero, Capabilities, Walkthrough, ForTeams,
                     Transparency, FinalCta, Footer
    preview/         interactive product preview (list, detail, pools, trade impact)
  styles/            tokens.css, base.css, ui.css, components.css, sections.css
scripts/audit-font-sizes.mjs
```

## Data: what is real and what isn't

There is **no live data source yet**. `src/data/source.ts` defines the
`MarketDataSource` interface; the only implementation, `sampleSource`, serves
illustrative values with a small artificial latency so loading states are
exercised. To go live, implement the interface against a real provider
(token list, price history, pools) and set `info.kind = 'live'` — the
"Sample data" badges disappear automatically.

Liquidity depth and trade-impact estimates are computed client-side with a
constant-product model over sample pool reserves; concentrated pools are
approximated with virtual reserves. They are analytics only — Verin does not
execute trades.

Not implemented (and not simulated): a data API, accounts, live data sources,
contract addresses and explorer links.

## Deep links

- `?token=<id>#preview` opens a token, e.g. `?token=op-optimism#preview`
- `?network=<id>#preview` filters to a network (`base`, `ethereum`, `arbitrum`, `optimism`)
- "Copy link" in the token detail copies the `?token=` link.
