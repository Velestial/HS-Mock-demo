# HeySkipper

## What This Is

HeySkipper is a headless React/TypeScript storefront for www.heyskipperfishing.com, backed by an existing WordPress/WooCommerce store. It replaces a slow, hard-to-update traditional WordPress theme with a fast, modern UI featuring bento grids and dedicated landing pages for Travel Rods and Salted Bait — products built for serious anglers. The site is designed to be maintained and extended by non-developers using Claude or Gemini.

## Core Value

A customer can discover HeySkipper fishing products through a beautiful, fast storefront and complete a purchase with confidence.

## Requirements

### Validated

<!-- These capabilities already exist in the prototype codebase. -->

- ✓ Product catalog browsing — Bait, Rod, Tackle, Bundle, Ebook pages — existing
- ✓ Shopping cart with add/remove/update quantity and localStorage persistence — existing
- ✓ Checkout flow with Stripe payments and WooCommerce order creation — existing
- ✓ User login and account page with order history — existing (demo auth only)
- ✓ WooCommerce product data fetching and mapping — existing
- ✓ Product image gallery with lightbox — existing
- ✓ Static legal pages (FAQ, Privacy, Terms, Rod Warranty) — existing
- ✓ Mobile-responsive layouts — existing

### Active

<!-- What we're building toward in v1. -->

- [ ] Real JWT authentication — replace demo email-only login with secure WooCommerce JWT auth
- [ ] Order tracking page — customers can look up current order status post-purchase
- [ ] Travel Rod landing page — brand story + specs + social proof + conversion CTA
- [ ] Salted Bait landing page — brand story + product lineup + conversion CTA
- [ ] Bento grid UI refresh — modernize homepage and product pages with bento grid layouts
- [ ] Stamped.io reviews integration — pull and display product reviews on product pages
- [ ] Mailchimp email signup — capture leads with inline and popup signup forms
- [ ] Emotive.io SMS opt-in — SMS marketing consent capture at checkout
- [ ] Performance optimization — optimize bundle size, image loading, and initial render
- [ ] Staging deployment setup — deploy to staging URL on TitanHostingHub for soft launch review
- [ ] AI-maintainable component architecture — clean, well-organized code that Claude/Gemini can navigate and extend

### Out of Scope

- Wishlist / save for later — v2 feature, not critical for launch
- Affiliate / referral program — growth feature, post-launch
- Apparel / merch category — future product line, not in current catalog
- Mobile app — web-first; mobile later
- Multi-currency / international shipping — US market focus for v1
- Full CMS (content editable without code) — AI-assisted editing covers this need

## Context

**Existing backend:** WordPress + WooCommerce at heyskipperfishing.com. REST API is already integrated in this codebase via `services/api.ts`. No backend migration needed.

**Current site problem:** Traditional WP theme is slow (PageSpeed issues), hard to maintain, and visually outdated. Customers expect the same quality from the site that they get from HeySkipper products.

**Products:** Travel Rods (hero product, needs flagship landing page), Salted Bait (hero product, needs flagship landing page), Tackle/Accessories, Bundles, Ebooks/Guides. More product lines planned for future.

**Maintenance model:** Owner uses Claude or Gemini to make changes — describe a change in English, AI implements it. Also expects to edit copy and images directly. Code must be readable and component-based so AI can navigate it confidently.

**Third-party services already decided:**
- Stamped.io — product reviews
- Mailchimp — email marketing
- Emotive.io — SMS marketing
- TitanHostingHub — web hosting
- Stripe — payments (already integrated)
- WooCommerce — backend/inventory/orders (already integrated)

**Launch plan:** Soft launch on staging URL first, then cut over domain to new frontend.

**Known tech debt in prototype (must fix before launch):**
- Demo authentication (email-only, password ignored) — security risk
- `dist/` directory committed — should be gitignored
- Debug scripts at root (`debug_api.js`, `test_mapper.js`) — should be removed
- Two entry points (`index.tsx` + `main.tsx`) — needs cleanup
- No error boundaries — uncaught errors crash entire app

## Constraints

- **Tech Stack**: React + TypeScript + Vite — already established, keep it
- **Backend**: WooCommerce REST API — no backend changes, frontend only
- **Hosting**: TitanHostingHub — deployment must be compatible
- **AI Maintainability**: Components must be clear, well-named, and modular so Claude/Gemini can understand and extend them without reading the entire codebase
- **Compatibility**: Must not break existing WooCommerce product data structure

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep WooCommerce backend | API already integrated, no data migration risk | — Pending |
| React + TypeScript + Vite frontend | Already built, strong ecosystem, AI tools understand it well | — Pending |
| JWT authentication for v1 | Demo auth is a security risk; must fix before launch | — Pending |
| Soft launch via staging | Reduce risk, validate before DNS cutover | — Pending |
| No CMS (AI-assisted editing instead) | Claude/Gemini covers maintenance needs; avoids CMS complexity | — Pending |

---
*Last updated: 2026-03-02 after initialization*
