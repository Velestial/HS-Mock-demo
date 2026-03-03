# Roadmap: HeySkipper

## Overview

HeySkipper is a headless React/TypeScript storefront that replaces a slow WordPress theme with a fast, brand-driven shopping experience. This milestone transforms a working prototype into a production-ready site: hardening the backend infrastructure and security defects first, then cleaning up the codebase and integrating third-party marketing tools, and finally delivering the two conversion-critical landing pages for Travel Rods and Salted Bait. The build order is dictated by pitfall severity — infrastructure and auth defects would corrupt orders and expose customer data if features were built on top of them.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Infrastructure** - Reconstruct the Express proxy server with all working endpoints and deploy to staging
- [ ] **Phase 2: Auth and Security** - Replace demo auth with real WooCommerce JWT login, registration, and PII-safe session storage
- [ ] **Phase 3: Data Integrity and Payment Hardening** - Fix product ID corruption in checkout and add Stripe webhook for payment confirmation
- [ ] **Phase 4: Code Quality and UI Foundations** - Reorganize codebase for AI maintainability, split CheckoutPage, and build shared UI primitives
- [ ] **Phase 5: Analytics and Third-Party Integrations** - Wire up GA4 tracking, Stamped.io reviews, and Emotive.io SMS opt-in
- [ ] **Phase 6: Landing Pages** - Build brand-driven TravelRod and SaltedBait landing pages with bento grid layouts
- [ ] **Phase 7: Order Tracking** - Add post-purchase order status lookup page

## Phase Details

### Phase 1: Infrastructure
**Goal**: The Express proxy server is live on staging with all API endpoints functional and CORS locked to the correct domains
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03
**Success Criteria** (what must be TRUE):
  1. `GET /api/health` returns 200 from the staging domain
  2. Product pages load live WooCommerce data through the Express proxy (not seed data or direct WooCommerce calls)
  3. CORS requests from a non-allowlisted domain are rejected with a CORS error
  4. All API routes (auth, products, orders, customers, payments) return responses rather than 404
**Plans**: TBD

Plans:
- [ ] 01-01: Audit and reconstruct Express server endpoints (auth, products, orders, customers, payments)
- [ ] 01-02: Deploy to TitanHostingHub staging and verify connectivity with frontend
- [ ] 01-03: Lock CORS allowlist to production and staging domains

### Phase 2: Auth and Security
**Goal**: Users can securely log in, register, and maintain sessions using real WooCommerce JWT authentication, with no customer PII stored beyond identity fields
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06
**Success Criteria** (what must be TRUE):
  1. User can log in with email and password and is granted access to the account page
  2. User remains logged in after a page refresh without re-entering credentials
  3. User can log out from any page and is immediately denied access to protected pages
  4. New customer can register with email and password and immediately log in
  5. Inspecting localStorage after login shows only id, email, and name — no billing address or phone number
**Plans**: TBD

Plans:
- [ ] 02-01: Implement JWT auth endpoints in Express (/api/auth/login, /api/auth/refresh, /api/auth/logout)
- [ ] 02-02: Migrate AuthContext to JWT — access token in-memory, refresh token in httpOnly cookie, schema version guard
- [ ] 02-03: Fix registration to call WooCommerce POST /customers (not login) and verify new accounts are created

### Phase 3: Data Integrity and Payment Hardening
**Goal**: Every order placed carries correct WooCommerce product IDs and is only marked paid after Stripe confirms the charge, and the production Turnstile CAPTCHA is active
**Depends on**: Phase 2
**Requirements**: DATA-01, DATA-02, PAY-01, PAY-02, PAY-03
**Success Criteria** (what must be TRUE):
  1. All products in the catalog are visible (full catalog, not truncated at 10 items)
  2. Adding an item to cart and checking out creates a WooCommerce order with the correct numeric product ID in the line item
  3. A simulated failed Stripe payment does not leave a "pending" WooCommerce order behind
  4. Checkout page uses the production Cloudflare Turnstile key (bot protection is active)
**Plans**: TBD

Plans:
- [ ] 03-01: Fix WooCommerce product fetch to use per_page=100 and add ID validation in productMapper
- [ ] 03-02: Remove seed data from data/products.ts and verify cart uses live WooCommerce product IDs
- [ ] 03-03: Implement Stripe payment_intent.succeeded webhook in Express to confirm WC order payment

### Phase 4: Code Quality and UI Foundations
**Goal**: The codebase is organized for AI-assisted maintenance with no files over 200 lines in the checkout flow, all components have navigational purpose comments, no any types in the service layer, and shared UI primitives exist for the landing pages
**Depends on**: Phase 3
**Requirements**: CODE-01, CODE-02, CODE-03, CODE-04, CODE-05, CODE-06, UI-01, UI-03, UI-04
**Success Criteria** (what must be TRUE):
  1. CheckoutPage.tsx no longer exists as a single file — checkout renders from step components each under 200 lines
  2. Every component file opens with a one-sentence comment describing its purpose
  3. components/ directory is organized into pages/, sections/, ui/, widgets/, and layout/ subdirectories
  4. Crashing a single page (e.g., BaitPage) shows a fallback error UI rather than a blank screen for the whole app
  5. BentoGrid component renders a grid layout when given columns and cell-span props
**Plans**: TBD

Plans:
- [ ] 04-01: Restructure components directory (pages/, sections/, ui/, widgets/, layout/), remove debug scripts, add dist/ to .gitignore
- [ ] 04-02: Split CheckoutPage into step components (CheckoutFormStep, CheckoutSuccessStep) and extract hooks
- [ ] 04-03: Add purpose comments to all component files and replace any types in services/api.ts with typed interfaces
- [ ] 04-04: Implement BentoGrid and BentoCell layout primitives; wrap all routable pages in ErrorBoundary; add lazy image loading

### Phase 5: Analytics and Third-Party Integrations
**Goal**: Purchase behavior is tracked in Google Analytics 4 and customers see real product reviews, can opt into SMS marketing at checkout, and the non-functional Emotive mock is replaced
**Depends on**: Phase 4
**Requirements**: ANLT-01, ANLT-02, ANLT-03, INT-01, INT-02, INT-03, INT-04
**Success Criteria** (what must be TRUE):
  1. Completing a purchase fires a GA4 purchase event visible in the GA4 DebugView with order value and product details
  2. Adding an item to the cart fires a GA4 add_to_cart event with product name and price
  3. Product pages with at least one Stamped.io review display the reviews widget; pages with zero reviews show nothing
  4. Checkout includes a working SMS opt-in with TCPA consent language (not the placeholder mock)
**Plans**: TBD

Plans:
- [ ] 05-01: Install GA4 and instrument page view, add-to-cart, and purchase events
- [ ] 05-02: Build StampedReviews widget component (lazy-loaded, re-initialized on product change, gated on review count > 0)
- [ ] 05-03: Replace EmotivePopup mock with real Emotive.io SDK integration and TCPA-compliant consent checkbox

### Phase 6: Landing Pages
**Goal**: Customers can navigate to dedicated Travel Rod and Salted Bait landing pages that tell the brand story, surface specs and social proof, address purchase objections, and offer a clear path to buy
**Depends on**: Phase 5
**Requirements**: PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, UI-02, NAV-01, NAV-02, NAV-03
**Success Criteria** (what must be TRUE):
  1. Visiting /travel-rod shows a narrative page with hero imagery, brand story, bento grid feature showcase, specs, warranty summary, FAQ accordion, and cross-sell section — with an Add to Cart CTA
  2. Visiting /salted-bait shows a narrative page with hero imagery, brand story, bait lineup, technique tips, FAQ accordion, and cross-sell section — with an Add to Cart CTA
  3. Both landing pages are linked in the main navigation
  4. Both landing pages include a FAQ accordion that can be expanded and collapsed
  5. Both landing pages show a "You might also need" cross-sell section with other products
  6. Navbar includes a "Shop" mega menu with links to Rod, Bundles, Bait, Tackle, and E-Books pages
  7. Top bar includes links to the FAQ page and Final Chance page
**Plans**: TBD

Plans:
- [ ] 06-01: Build TravelRodPage with all required sections (hero, story, bento specs, warranty, FAQ, cross-sell, CTA)
- [ ] 06-02: Build SaltedBaitPage with all required sections (hero, story, bait lineup, technique tips, FAQ, cross-sell, CTA)
- [ ] 06-03: Wire routes in App.tsx, add nav links, integrate homepage bento grid layout
- [ ] 06-04: Implement Shop mega menu in Navbar and add FAQ/Final Chance links to top bar

### Phase 7: Order Tracking
**Goal**: Customers who have completed a purchase can look up their current order status without logging in
**Depends on**: Phase 6
**Requirements**: ORDER-01, ORDER-02
**Success Criteria** (what must be TRUE):
  1. Entering a valid order number and email address on the order tracking page returns the current WooCommerce order status
  2. Entering an invalid order number or mismatched email shows a clear "order not found" message rather than an error crash
**Plans**: TBD

Plans:
- [ ] 07-01: Build OrderTrackingPage with order number + email lookup form and status display

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure | 0/3 | Not started | - |
| 2. Auth and Security | 0/3 | Not started | - |
| 3. Data Integrity and Payment Hardening | 0/3 | Not started | - |
| 4. Code Quality and UI Foundations | 0/4 | Not started | - |
| 5. Analytics and Third-Party Integrations | 0/3 | Not started | - |
| 6. Landing Pages | 0/3 | Not started | - |
| 7. Order Tracking | 0/1 | Not started | - |
