# Requirements: HeySkipper

**Defined:** 2026-03-02
**Core Value:** A customer can discover HeySkipper fishing products through a beautiful, fast storefront and complete a purchase with confidence.

## v1 Requirements

Requirements for launch. Each maps to roadmap phases.

### Infrastructure

- [x] **INFRA-01**: Express API server is fully implemented with all endpoints (products, orders, customers, payments, auth)
- [x] **INFRA-02**: Server deployed to TitanHostingHub and accessible from frontend on staging domain
- [x] **INFRA-03**: CORS origin allowlist configured for production and staging domains only (not open wildcard)

### Authentication

- [ ] **AUTH-01**: User can log in with email and password using WooCommerce JWT authentication
- [ ] **AUTH-02**: JWT access token is stored in-memory (not localStorage); refresh token stored in httpOnly cookie
- [ ] **AUTH-03**: User session persists across page refresh via silent token refresh on mount (<200ms)
- [ ] **AUTH-04**: User can log out from any page, clearing all tokens and session data
- [ ] **AUTH-05**: New customers can register an account with email and password
- [ ] **AUTH-06**: Stored user data in localStorage contains only identity fields (id, email, name) — no billing address, phone, or PII

### Payments

- [ ] **PAY-01**: Stripe webhook handler processes `payment_intent.succeeded` to confirm payment before WooCommerce order is marked paid
- [ ] **PAY-02**: Failed or abandoned Stripe payments do not leave orphaned "pending" WooCommerce orders
- [ ] **PAY-03**: Production Cloudflare Turnstile key is used at checkout (not the `1x000...` test key)

### Data Integrity

- [ ] **DATA-01**: WooCommerce product fetch uses `per_page=100` to return the complete product catalog (not default 10)
- [ ] **DATA-02**: WooCommerce numeric product IDs are used for all cart and order line items (no local seed data IDs)

### Landing Pages

- [ ] **PAGE-01**: Travel Rod landing page includes hero section with product-in-use imagery, brand narrative ("problem we solved"), bento grid specs, warranty summary, and "Add to Cart" CTA
- [ ] **PAGE-02**: Salted Bait landing page includes hero section with product-in-use imagery, brand narrative, bait lineup, technique tips, and "Add to Cart" CTA
- [ ] **PAGE-03**: Both landing pages are accessible at dedicated routes and linked from the main navigation
- [ ] **PAGE-04**: Both landing pages include a FAQ accordion addressing common purchase objections
- [ ] **PAGE-05**: Both landing pages include a "You might also need" cross-sell section with complementary products

### Navigation

- [ ] **NAV-01**: Navbar includes a "Shop" mega menu with links to Rod, Bundles, Bait, Tackle, and E-Books pages
- [ ] **NAV-02**: Top bar includes a link to the FAQ page
- [ ] **NAV-03**: Top bar includes a link to the Final Chance page

### UI Refresh

- [ ] **UI-01**: BentoGrid component is implemented as a reusable layout primitive (columns, cell span)
- [ ] **UI-02**: Homepage uses bento grid layout
- [ ] **UI-03**: Error boundaries are applied to every routable page — uncaught errors show a fallback page, not a blank screen
- [ ] **UI-04**: All product images use `loading="lazy"` below the fold and `loading="eager"` in hero sections with explicit width/height

### Order Tracking

- [ ] **ORDER-01**: User can look up order status by entering order number and email address
- [ ] **ORDER-02**: Order tracking page displays current WooCommerce order status (pending, processing, completed, etc.)

### Third-Party Integrations

- [ ] **INT-01**: Stamped.io reviews widget displays product reviews on product pages and landing pages
- [ ] **INT-02**: Stamped.io widget loads only when product has at least 1 review (no zero-star placeholder)
- [ ] **INT-03**: Emotive.io SMS opt-in is functional at checkout — replaces non-functional EmotivePopup mock
- [ ] **INT-04**: Emotive.io opt-in includes proper TCPA consent language

### Analytics

- [ ] **ANLT-01**: Google Analytics 4 is installed and tracking page views across all routes
- [ ] **ANLT-02**: Purchase events are tracked with order value and product details on checkout success
- [ ] **ANLT-03**: Add-to-cart events are tracked with product name and price

### Code Quality

- [ ] **CODE-01**: Components organized into `pages/`, `sections/`, `ui/`, `widgets/`, `layout/` subdirectories
- [ ] **CODE-02**: CheckoutPage.tsx split into step components (form, payment, success), each under 200 lines
- [ ] **CODE-03**: All component files include a one-sentence purpose comment at the top (primary AI navigation aid)
- [ ] **CODE-04**: No `any` types in `services/api.ts` — all API functions have typed request/response interfaces
- [ ] **CODE-05**: Debug scripts removed from root (`debug_api.js`, `test_mapper.js`, `test_mapper.ts`, `index.tsx`)
- [ ] **CODE-06**: `dist/` directory added to `.gitignore`

## v2 Requirements

Deferred to post-launch. Not in current roadmap.

### Marketing

- **MKT-01**: Mailchimp email signup inline on landing pages and footer
- **MKT-02**: Mailchimp popup on exit intent (not on page load)

### Commerce

- **COM-01**: Wishlist / save for later on product pages
- **COM-02**: Affiliate / referral program
- **COM-03**: Apparel / merch category page (when product line is added)

### Performance

- **PERF-01**: React Query for product data caching with stale-while-revalidate
- **PERF-02**: WebP image conversion for all product photos

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mobile app | Web-first; mobile is a future milestone |
| Multi-currency / international shipping | US market focus for v1 |
| Full CMS (Contentful, Sanity, etc.) | AI-assisted editing via Claude covers the maintenance need |
| Instagram feed embed | Third-party embed APIs are unreliable; update manually as static images |
| Real-time chat / chatbot | No one is staffing it; FAQ handles common questions |
| Countdown timers / fake scarcity | Destroys trust with serious anglers who research before buying |
| Infinite scroll product feed | Contradicts the curated landing page goal |
| Video autoplay with sound | Browser policy violations; use muted autoplay or static imagery |

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Complete |
| INFRA-03 | Phase 1 | Pending |
| AUTH-01 | Phase 2 | Pending |
| AUTH-02 | Phase 2 | Pending |
| AUTH-03 | Phase 2 | Pending |
| AUTH-04 | Phase 2 | Pending |
| AUTH-05 | Phase 2 | Pending |
| AUTH-06 | Phase 2 | Pending |
| PAY-01 | Phase 3 | Pending |
| PAY-02 | Phase 3 | Pending |
| PAY-03 | Phase 3 | Pending |
| DATA-01 | Phase 3 | Pending |
| DATA-02 | Phase 3 | Pending |
| PAGE-01 | Phase 6 | Pending |
| PAGE-02 | Phase 6 | Pending |
| PAGE-03 | Phase 6 | Pending |
| PAGE-04 | Phase 6 | Pending |
| PAGE-05 | Phase 6 | Pending |
| NAV-01 | Phase 6 | Pending |
| NAV-02 | Phase 6 | Pending |
| NAV-03 | Phase 6 | Pending |
| UI-01 | Phase 4 | Pending |
| UI-02 | Phase 6 | Pending |
| UI-03 | Phase 4 | Pending |
| UI-04 | Phase 4 | Pending |
| ORDER-01 | Phase 7 | Pending |
| ORDER-02 | Phase 7 | Pending |
| INT-01 | Phase 5 | Pending |
| INT-02 | Phase 5 | Pending |
| INT-03 | Phase 5 | Pending |
| INT-04 | Phase 5 | Pending |
| CODE-01 | Phase 4 | Pending |
| CODE-02 | Phase 4 | Pending |
| CODE-03 | Phase 4 | Pending |
| CODE-04 | Phase 4 | Pending |
| CODE-05 | Phase 4 | Pending |
| CODE-06 | Phase 4 | Pending |
| ANLT-01 | Phase 5 | Pending |
| ANLT-02 | Phase 5 | Pending |
| ANLT-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 41 total
- Mapped to phases: 41
- Unmapped: 0

---
*Requirements defined: 2026-03-02*
*Last updated: 2026-03-02 — added NAV-01, NAV-02, NAV-03 (Shop mega menu, FAQ and Final Chance top bar links)*
