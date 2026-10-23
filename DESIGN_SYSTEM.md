# Verin design system

Verin is an independent product. Its visual language is built from the public
[Base brand guidelines](https://brand.base.org/) so it sits naturally in the Base
ecosystem, but it does **not** use Base identifiers (the Square, Basemark or
logotype) and does not imply affiliation. All tokens live in
`src/styles/tokens.css`; components reference semantic tokens only.

## How this was derived

| Source | What we took | What we rejected |
| --- | --- | --- |
| brand.base.org/color | Core palette verbatim (Base Blue `#0000ff`, Gray 0–100). Secondary palette (Cerulean, Yellow, Green, Red, Pink, Tan, Lime) only for supplementary fills. Rule: grayscale and negative space outweigh blue; blue is reserved for the single most important element. No gradients, no opacity effects. | — |
| brand.base.org/typography | Base Sans / Base Mono are not in the public brand kit, so we use the documented fallbacks: **Inter Tight** (sans), **Roboto Mono** (mono), **Doto** (short all-caps labels only). Headline kerning −3% / leading 100%; subheadline −2% / 120%; ligatures off. | — |
| brand.base.org/motion | One easing curve `cubic-bezier(0.4, 0, 0.2, 1)`; UI feedback 120–240 ms; intros under 800 ms; simple slide-ins; no motion blur, no 3D. | Square-led choreography (that's Base's identifier, not ours). |
| UI/UX Pro Max `--design-system` (query: "crypto trading fintech exchange", variance 6, motion 3, density 6) | Style: **Minimalism & Swiss** (grid-based, high contrast, functional). Pattern: trust-first page with a clear CTA path. Checklist: SVG icons, visible focus, 4.5:1 text, reduced motion, 375/768/1024/1440 checks. Chart guidance: don't rely on colour alone, provide keyboard focus and text fallbacks. | Its suggested gold/purple palette and Orbitron/Exo 2 fonts — they conflict with the Base guidelines this project must follow. Its first query ("…market intelligence…") misrouted to an "AI-native" purple style and was discarded per the skill's retry rule. "Security badges / certs" — we have none and invent none. |
| mobula.io + docs | Product category: a crypto market-data platform for users and developers — discovery → token detail (price history, market stats, pools/markets) → data access, with provenance and freshness treated as first-class. | Its B2B API positioning, layout and assets. |

## Colour

Semantic roles (see `tokens.css` for the full list):

| Role | Token | Value |
| --- | --- | --- |
| Page / surface | `--bg`, `--surface` | Gray 0 |
| Subtle section / sunken | `--bg-subtle`, `--surface-sunken` | Gray 10 |
| Text | `--text` | Gray 100 |
| Secondary text | `--text-secondary` | Gray 60 (6.21:1 on white) |
| Disabled text | `--text-disabled` | Gray 50 (disabled only — 4.44:1 is below AA) |
| Brand / primary CTA | `--accent`, `--cta-bg` | Base Blue (8.59:1 with white) |
| CTA hover | `--cta-bg-hover` | Gray 100 |
| Borders | `--border`, `--border-strong` | Gray 15, Gray 30 |
| Focus | `--focus` | Base Blue, 2px outline + 2px offset |
| Sample-data badge | `--warning-fill` | Yellow with Gray 100 text (13.5:1) |
| Positive / negative **text** | `--positive`, `--negative` | `#2f7d00` (5.18:1), `#c42a0e` (5.70:1) |
| Positive / negative **fill** | `--positive-fill`, `--negative-fill` | Base Green, Base Red |

**Assumption, documented:** Base Green (2.14:1) and Base Red (3.56:1) fail AA as
small text on white. Base's own guidance says product UI uses a separate
accessibility-optimised palette that is not public, so we added three
product-only text values (`--a11y-*`). They are never used as brand colour.
Market direction is always also conveyed by an arrow icon, a sign and
screen-reader text — never colour alone.

Light theme only for now. A dark theme would need its own AA verification
(Base Blue on Gray 100 is only ~2.4:1; Cerulean would carry accent text).

## Typography

**Hard floor: no rendered text below 12px.** Enforced three ways:
`--fs-12` is the smallest token; `npm run audit:fonts` fails the build of any
CSS/TSX font size (including `clamp()` minimums) under 12px; and the QA run
walks every text node at 320–1920px checking computed size.

| Token | Size | Use |
| --- | --- | --- |
| `--fs-display` | clamp(40 → 88px) | Hero and final CTA headlines |
| `--fs-h2` | clamp(32 → 56px) | Section headings |
| `--fs-32` | 32px | Token price |
| `--fs-24` | 24px | Card headings, amounts |
| `--fs-18/20` | 18/20px | Lead copy, sub-headings |
| `--fs-16` | 16px | Body, inputs (prevents iOS zoom), buttons |
| `--fs-14` | 14px | Dense UI, table cells, helper text |
| `--fs-12` | 12px | Axis labels, captions, badges — **minimum** |

Numbers use Roboto Mono with tabular figures (`.num`). Prices scale precision
with magnitude; compact notation (`$1.84B`) for market cap, volume and
liquidity; true minus sign (−) for negatives.

## Spacing, geometry, layers

4px rhythm (`--space-1` … `--space-24`); fluid `--gutter` (16 → 40px) and
`--section-y`. Container 1280px. Radii: 4 / 6 / 8 / 12px (xs, chips, controls,
panels) — round only for avatars and dots. Control heights 36 / 44 / 52px; 44px
is the minimum touch target. Two shadows (raised, overlay). Z-index scale:
raised, sticky, header, overlay, tooltip.

## Icons

Lucide (SVG, 2px stroke, one family). Always `aria-hidden` with a text label or
`aria-label` on the control. No emoji. Token avatars are monograms on palette
fills — real token logos are not bundled.

## Motion

`--dur-fast` 120ms (press), `--dur-base` 180ms (hover/colour),
`--dur-slow` 240ms (dialog), `--dur-intro` 560ms (hero cards). All collapse to
0ms under `prefers-reduced-motion`, which also disables the caret blink,
skeleton pulse, intro animation and smooth scrolling.

## Data honesty rules

- Every data surface shows a **Sample data** badge (driven by
  `dataSource.info.kind`; it disappears automatically for a live adapter).
- The snapshot time is a fixed sample timestamp, labelled as a snapshot.
- Liquidity and trade-impact maths run in the browser on sample reserves and
  say so. Verin is a data product: nothing is executed, and no wallet,
  transaction or confirmation is ever simulated.
- No partner logos, audits, volumes, user counts or benchmarks.
