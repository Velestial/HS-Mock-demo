# Project Research Summary

**Project:** HeySkipper — Headless WooCommerce Storefront Upgrade
**Domain:** Specialty fishing e-commerce — headless React storefront on WooCommerce backend
**Researched:** 2026-03-02
**Confidence:** HIGH (architecture and pitfalls sourced from direct codebase analysis; features and stack sourced from domain knowledge and integration documentation)

---

## Executive Summary

HeySkipper is a specialty fishing e-commerce brand upgrading its existing React 19 + TypeScript + Vite + WooCommerce storefront from prototype-grade code to a production-ready, brand-driven shopping experience. The primary deliverable is a set of narrative landing pages for two hero products (Travel Rods and Salted Bait) that go well beyond product grids to tell a founder story, address buyer objections inline, and funnel visitors toward conversion. Secondary deliverables are three marketing integrations (Stamped.io reviews, Mailchimp email capture, Emotive.io SMS opt-in) and a hardened authentication and payment stack.

The recommended build approach is a component-layered architecture with a strict four-tier hierarchy: page containers own context reads and data orchestration, section components are purely props-driven, UI atoms have no state knowledge, and all external HTTP calls are centralized in a typed service layer behind an Express proxy. This approach is explicitly designed for AI-assisted maintenance — every file does one job, no file exceeds 200 lines, and adding a new product page is a three-file operation that touches nothing outside its own directory. The bento grid layout pattern is the visual organizing principle for landing pages, matching the brand's tactical, serious aesthetic.

The single most urgent risk is that the current codebase has five critical defects that will cause production failures before any new feature is built: the Express server has no implemented endpoints (a blocker for all API-dependent features), the auth flow stores full customer PII in localStorage, the register() function is wired to login() and silently fails, product IDs resolve to 0 in checkout line items (corrupting WooCommerce orders), and there is no Stripe webhook to handle payment failures. These must be resolved before features are layered on top. The mitigation strategy is a strict build-order that resolves infrastructure and security first, then data integrity, then features.

---

## Key Findings

### Recommended Stack

The existing stack is correct for this project and should not change: React 19 + TypeScript + Vite on the frontend, Express (Node.js) proxy server securing backend credentials, and WooCommerce REST API as the product/order backend. The integration additions — Stamped.io, Mailchimp, and Emotive.io — are all JavaScript widget embeds or REST API calls, not npm packages, and require no new frontend framework dependencies.

The critical stack decision is JWT token storage: access token in React state (in-memory, 15-minute lifetime), refresh token in an httpOnly cookie set by Express (7-day lifetime). This is the only pattern that is both XSS-safe and survives page refreshes. The WooCommerce JWT plugin (`JWT Authentication for WP REST API` by Enrique Chavez) is the standard solution for browser-based auth against WooCommerce.

**Core technologies:**
- React 19 + TypeScript: existing frontend — no change needed
- Vite: build tool with manual chunk splitting for vendor, Stripe, Framer Motion — reduces bundle size
- Express proxy server: secures all backend credentials; all WooCommerce and Stripe secrets live here, never in the Vite build
- WooCommerce REST API: product catalog, order creation, customer management
- JWT (via `jwt-authentication-for-wp-rest-api` WordPress plugin): browser-safe auth, replaces current demo auth
- Stamped.io: JavaScript widget embed for reviews, re-initialized via useEffect on product change
- Mailchimp: custom React form posting to `/api/subscribe` on Express (preserves design control, hides API key)
- Emotive.io: JavaScript widget embed for SMS opt-in; TCPA compliance checkbox required at checkout
- Vite manual chunking + React.lazy: performance optimization for larger new pages

### Expected Features

See `.planning/research/FEATURES.md` for full feature matrix.

**Must have (table stakes) — users expect these or trust erodes immediately:**
- Hero section with product-in-use imagery above the fold — anglers need to see the product working, not on a white background
- Price visible without scrolling — reduces bounce on high-ticket items
- Single dominant CTA per page section — no competing buttons above the fold
- Product image gallery with zoom/lightbox — already built (Lightbox.tsx), wire into landing pages
- Detailed scannable specs — anglers filter by length, action, and line rating before anything else
- Shipping timeline + return/warranty summary near the CTA — lifetime warranty is a purchase driver
- Secure checkout badges (ShieldCheck, Stripe logo) — reduces checkout hesitation
- Mobile-responsive layout — fishing gear is heavily mobile-shopped

**Should have (competitive differentiators):**
- Founder/origin story section — specialty buyers purchase from people, not warehouses
- "Problem we solved" narrative — names the pain before presenting the solution; makes benefits concrete
- Bento grid feature showcase — visually distinctive vs standard outdoor retail layouts
- Product comparison table within the line — helps buyer pick the right rod without leaving the page
- FAQ accordion addressing purchase objections inline — "Will airline security flag this?"
- Cross-sell section (Travel Rod page → Bait bundles; Bait page → Tackle/Rig kits)
- Mailchimp inline email capture mid-page — captures visitors who aren't ready to buy
- Stamped.io review display with star rating — reduces hesitation (depends on review volume)
- Emotive.io SMS opt-in at checkout — low-friction SMS list building

**Defer to v2+:**
- UGC photo reviews — requires review volume to accumulate; use text testimonials as bridge
- Video hero — requires production video asset
- Wishlist / Save for Later — explicitly v2 in PROJECT.md
- Affiliate / referral program — explicitly v2 in PROJECT.md

### Architecture Approach

The recommended architecture is a Component-Layered Headless Storefront with strict separation between page containers (own all context reads), section components (props-driven, no context access), UI atoms (no state), widget components (isolated from app state, receive only minimum props), and a typed service layer (no `any`, returns typed responses). Third-party widgets (Stamped.io, Mailchimp, Emotive.io) are isolated leaf components wrapped in ErrorBoundary components and loaded via a `useExternalScript` hook — never via `<script>` tags in index.html. All API traffic routes through the Express proxy server. JWT access tokens live in React state; refresh tokens live in httpOnly cookies set by Express.

**Major components:**
1. Express Proxy Server — secures all backend credentials; handles JWT lifecycle (`/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`), WooCommerce product/order/customer proxying, and Stripe payment intents
2. AuthContext — owns JWT access token in-memory, minimal user summary in localStorage (id, email, name only — no PII), exposes login/logout/register/refreshToken
3. CartContext — owns cart items, persists to localStorage, exposes CRUD operations
4. ProductContext — fetches from WooCommerce via Express proxy, caches in memory for session
5. TravelRodPage / SaltedBaitPage — new page containers composing narrative sections and bento grid blocks
6. Widget components (StampedReviews, MailchimpSignup, EmotiveOptIn) — isolated, wrapped in ErrorBoundary, load scripts lazily

### Critical Pitfalls

See `.planning/research/PITFALLS.md` for full analysis including detection and phase assignments.

1. **Express server has no implemented endpoints** — `server/index.cjs` contains only a health check; all API calls return 404. This is a complete blocker. Reconstruct or verify server implementation before any other backend work begins.

2. **JWT migration silently breaks all existing user sessions** — AuthContext.tsx stores a full WooCommerce customer object in localStorage. When JWT is introduced, the stored structure changes and all users are silently logged out. Prevention: add schema version key (`heyskipper_auth_version: "2"`) and clear stale localStorage on mount before any JWT code ships.

3. **Full customer PII in localStorage is readable by every third-party script** — AuthContext.tsx serializes billing address, phone, and email to localStorage. Stamped.io, Emotive.io, and Mailchimp CDN scripts can all read this. Fix: store only `{ id, email, first_name, last_name }` — fix simultaneously with JWT work.

4. **Ghost WooCommerce orders accumulate when Stripe payment fails** — WC order is created before payment is confirmed; no Stripe webhook handler exists. Fix: add Stripe `payment_intent.succeeded` webhook to `server/index.cjs` before accepting real payments.

5. **Product IDs resolve to 0 in checkout line items** — `productMapper.ts` uses fuzzy name matching; `CheckoutPage.tsx` sends `product_id: 0` when ID lookup fails, creating WooCommerce custom line items with no inventory linkage. Fix: remove seed data in `data/products.ts` after WooCommerce integration is live; add validation in `mapWooProductToAppProduct()`.

---

## Implications for Roadmap

Based on the combined research, the pitfalls research defines a mandatory sequencing constraint: infrastructure and security defects must be resolved before feature work begins. The architecture research defines a layered build order within each phase. The features research clarifies which deliverables are conversion-critical versus nice-to-have. The stack research confirms no major dependency additions are needed.

Suggested phase structure: 7 phases.

---

### Phase 1: Infrastructure — Reconstruct the Express Server

**Rationale:** Pitfall 5 is a complete blocker. Without a functioning Express server, every API-dependent feature (auth, products, orders, checkout) returns 404. This is the foundation everything else builds on. No other backend phase is possible until this is resolved.

**Delivers:** Working Express proxy with endpoints for auth, products, orders, customers, and payments. Health check verifiable with `GET /api/health`. CORS locked to production domains.

**Addresses:** Server endpoint gap (P5), CORS wildcard (P13)

**Avoids:** Wasting effort on auth or payment work against a non-functional backend

**Research flag:** NEEDS investigation — determine whether the full server implementation exists in a separate repository or on the hosting server before reconstructing from scratch.

---

### Phase 2: Security and Auth — JWT Migration + PII Reduction

**Rationale:** Auth is upstream of every authenticated feature (account page, order tracking, saved preferences). The three auth pitfalls (P1, P3, P11) must all be fixed together in one coordinated migration — a partial fix creates inconsistent state worse than the current situation. JWT work also establishes the axios interceptor pattern that all subsequent API calls depend on.

**Delivers:** Working JWT login/logout/register/refresh flow. Access token in React state. Refresh token in httpOnly cookie. Minimal user summary (id, email, name) in localStorage. `register()` correctly calls WooCommerce `POST /customers`. Schema version guard clears stale localStorage on deploy.

**Uses:** `JWT Authentication for WP REST API` WordPress plugin; axios interceptor pattern from STACK.md; `services/apiClient.ts` with 401 retry logic

**Implements:** AuthContext (JWT-aware), Express `/api/auth/*` endpoints, schema version guard

**Avoids:** Session breakage on JWT deploy (P1), PII exposure to third-party scripts (P3), silent registration failure (P11)

**Research flag:** Confirm which JWT plugin is installed on the WooCommerce server (`jwt-authentication-for-wp-rest-api` vs `Simple JWT Login` have different token formats before writing the Express auth handler).

---

### Phase 3: Data Integrity — Product ID Validation and Seed Data Removal

**Rationale:** Cannot accept real orders with `product_id: 0` line items — stock is never decremented and WooCommerce treats them as custom items. This is a data corruption issue that must be resolved before any real purchases are processed. Depends on Phase 1 (working product endpoint) and Phase 2 (auth for customer lookups).

**Delivers:** Live product data from WooCommerce replacing `data/products.ts` seed data. Validation warning in `mapWooProductToAppProduct()` if `wpProduct.id` is undefined. WooCommerce API call sets `per_page=100` to prevent silent product truncation (P7).

**Avoids:** Product ID 0 in orders (P4), silent product list truncation (P7)

---

### Phase 4: Payment Hardening — Stripe Webhook and Checkout Cleanup

**Rationale:** Cannot accept real payments without a Stripe webhook — failed payments create ghost WooCommerce orders that accumulate and corrupt inventory. Turnstile CAPTCHA using the test key means zero bot protection against carding attacks. The 670-line CheckoutPage is also a maintenance liability that degrades AI-assisted edits. All three issues must be resolved before production traffic.

**Delivers:** Stripe `payment_intent.succeeded` webhook in Express that transitions WC order status. Turnstile site key moved to `VITE_TURNSTILE_SITE_KEY` env var with production key registered. CheckoutPage split into `useShippingCalculator.ts`, `useCheckoutForm.ts`, `useStripePayment.ts`, `CheckoutFormStep.tsx`, `CheckoutSuccessStep.tsx` (each under 200 lines). Nominatim geocoding removed or cached by zip code.

**Avoids:** Ghost WC orders on payment failure (P2), test-key CAPTCHA bypass (P8), large file AI edit errors (P9), geocoding rate limit ban (P12)

---

### Phase 5: Component Foundations — Bento Grid and Shared UI

**Rationale:** Before building the landing pages, the shared visual primitives and error isolation infrastructure must exist. BentoGrid and BentoCell are used across both new landing pages and cannot be built ad-hoc inside page components. ErrorBoundary must wrap all widget components before any third-party SDK is integrated. This phase has no external dependencies and can begin in parallel with Phase 4.

**Delivers:** `BentoGrid.tsx` and `BentoCell.tsx` as layout primitives. `ErrorBoundary.tsx` wrapping widget insertion points. `useExternalScript.ts` hook for lazy script loading. `types.ts` updated with AuthUser, LoginRequest, LoginResponse, JWTPayload.

**Implements:** Pattern 2 (Bento Grid as layout primitive), Pattern 6 (ErrorBoundary per page), Pattern 7 (lazy script loading) from ARCHITECTURE.md

---

### Phase 6: Third-Party Integrations — Stamped, Mailchimp, Emotive

**Rationale:** Integrations are isolated widget components that have no dependencies on landing page content. They can be built and tested independently. Error boundaries from Phase 5 are a prerequisite — without them, a CDN failure crashes the entire app. The Emotive mock popup (P10) is currently shipping a form that silently discards input and must be replaced before the next user sees it.

**Delivers:** `StampedReviews.tsx` widget (lazy-loaded, re-initialized on product change, props-only). `MailchimpSignup.tsx` with custom React form posting to Express `/api/subscribe` (hides API key). `EmotiveOptIn.tsx` replacing the current mock with real SDK integration or explicit removal. TCPA-compliant SMS consent checkbox at checkout.

**Avoids:** Widget crash unmounting the app (P6), silent Emotive form discard (P10)

**Research flag:** Verify Stamped.io current review volume before enabling star display — zero-star display hurts trust more than showing nothing (FEATURES.md anti-feature). Confirm Emotive.io API key and sandbox availability before integration.

---

### Phase 7: Landing Pages — TravelRodPage and SaltedBaitPage

**Rationale:** This is the highest conversion-impact deliverable and the reason for this milestone. All preceding phases clear the defects and infrastructure that would otherwise corrupt orders or crash the app when real traffic arrives. With a clean foundation, the landing pages can be built confidently using the established patterns.

**Delivers:** `TravelRodPage.tsx` and `SaltedBaitPage.tsx` as narrative landing pages with: full-bleed hero, "problem we solved" section, bento grid feature showcase, specs comparison table, warranty/returns summary card, FAQ accordion, cross-sell section, inline Mailchimp email capture, Stamped.io reviews, and a clear single CTA per section. Route wiring in App.tsx with `React.lazy()` + Suspense. OrderTrackingPage as a bonus deliverable using the established auth and order patterns.

**Implements:** Pattern 1 (Page = Container, Section = Display), Pattern 3 (AI-navigable file naming), Pattern 4 (typed service layer) from ARCHITECTURE.md

**Avoids:** Generic grid as landing page (anti-feature), multiple competing CTAs (anti-feature), popup email capture on load (anti-feature)

**Research flag:** Confirm HeySkipper has product-in-use photography for full-bleed hero before designing the hero section. Confirm founder story text and photo are available before committing to the founder section.

---

### Phase Ordering Rationale

- Phases 1-4 are sequenced entirely by the pitfalls research: each is a hard dependency for the next. Infrastructure must precede auth; auth must precede data integrity; data integrity and payment hardening must both precede real orders.
- Phase 5 (foundations) has no external dependencies and can overlap with Phase 4. It is placed here because it is a prerequisite for Phase 6.
- Phase 6 (integrations) is isolated from Phase 7 (landing pages) because widgets are leaf components that don't depend on page structure — this allows parallel development if bandwidth allows.
- Phase 7 (landing pages) is last because it benefits from all prior work: clean auth for order tracking, clean product IDs for the cart, working integrations for reviews and email capture, and established bento grid primitives for layout.

---

### Research Flags

**Needs deeper research before planning:**
- **Phase 1 (Infrastructure):** Determine whether a complete server implementation exists elsewhere before reconstructing — the current `server/index.cjs` stub may be a placeholder, not the full implementation.
- **Phase 2 (Auth):** Confirm exact WooCommerce JWT plugin installed and its token format — `jwt-authentication-for-wp-rest-api` and `Simple JWT Login` have incompatible token formats that require different Express handler implementations.
- **Phase 6 (Emotive):** Confirm Emotive.io account, API key, and sandbox availability — confidence is MEDIUM on this integration; actual SDK behavior may differ from research.

**Standard patterns — skip research-phase:**
- **Phase 3 (Data Integrity):** Well-understood WooCommerce API pagination and product mapper refactor — no novel patterns.
- **Phase 4 (Payment Hardening):** Stripe webhook patterns are extensively documented — standard implementation.
- **Phase 5 (Bento Grid):** Pure CSS/React component work — no external dependencies.
- **Phase 7 (Landing Pages):** Established pattern from ARCHITECTURE.md; primary dependency is content assets (photography, copy), not technical decisions.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Existing stack is confirmed by codebase analysis; integration methods sourced from official Stamped.io, Mailchimp, and WooCommerce documentation |
| Features | MEDIUM-HIGH | Feature priorities sourced from e-commerce conversion research and direct analysis of existing RodPage.tsx/BaitPage.tsx; Stamped.io review volume and available photography are unknown variables |
| Architecture | HIGH | Sourced from direct codebase analysis; patterns are well-established React conventions; four-tier hierarchy is unambiguous |
| Pitfalls | HIGH | Every critical pitfall is sourced from direct line-by-line analysis of AuthContext.tsx, CheckoutPage.tsx, server/index.cjs, services/api.ts, and utils/productMapper.ts — not inference |

**Overall confidence:** HIGH for technical implementation. MEDIUM for content-dependent features (photography, founder story, review volume).

---

### Gaps to Address

- **Server implementation location:** The critical question is whether `server/index.cjs` is a stub in an otherwise complete separate deployment, or whether endpoints genuinely need to be built from scratch. Resolution: check TitanHostingHub server, check any separate repository, before Phase 1 work begins.
- **WooCommerce JWT plugin identity:** Two plugins have different token formats. Resolution: log into WordPress admin and check installed plugins before writing the Express auth handler.
- **Product photography availability:** The hero section design depends entirely on whether full-bleed product-in-use photography exists. Resolution: confirm with the owner before designing TravelRodPage hero section.
- **Stamped.io review volume:** The star rating widget should not be displayed until sufficient reviews exist to avoid the zero-star anti-pattern. Resolution: check Stamped.io dashboard during Phase 6 before enabling the display.
- **Hosting Node.js support:** If TitanHostingHub does not support persistent Node.js processes, the Express proxy architecture requires a rethink (static export + serverless functions or alternative). Resolution: confirm hosting capabilities before Phase 1.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis: `AuthContext.tsx`, `CheckoutPage.tsx`, `server/index.cjs`, `services/api.ts`, `utils/productMapper.ts` — basis for all pitfall findings
- WooCommerce REST API documentation — product/order/customer endpoint patterns
- Stripe documentation — payment intent lifecycle and webhook patterns

### Secondary (MEDIUM-HIGH confidence)
- Stamped.io JavaScript widget integration documentation — widget initialization and re-init pattern
- Mailchimp Members API documentation — email subscription endpoint
- JWT Authentication for WP REST API plugin documentation (motionpictures.org) — token flow

### Tertiary (MEDIUM confidence)
- Emotive.io integration documentation — SMS opt-in widget pattern (less detailed public documentation; behavior in production may differ)

---

*Research completed: 2026-03-02*
*Ready for roadmap: yes*
