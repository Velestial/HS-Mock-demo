# Domain Pitfalls

**Domain:** Headless WooCommerce React storefront — production upgrade from prototype
**Researched:** 2026-03-02
**Confidence:** HIGH (sourced from direct codebase analysis of AuthContext.tsx, CheckoutPage.tsx, server/index.cjs, services/api.ts, utils/productMapper.ts)

---

## Critical Pitfalls

### Pitfall 1: JWT Migration Breaks Existing User Sessions Without Warning

**What goes wrong:** `AuthContext.tsx` stores a full WooCommerce customer object in `localStorage`. When JWT is introduced, the stored structure changes. Existing users with the old format get into a broken state — the app tries to restore `stored.token` which doesn't exist, treating them as unauthenticated. `fetchCustomerOrders()` returns `[]` on error (silently masks 401 failures).

**Consequences:** All users silently logged out on first visit after JWT deploy.

**Prevention:** Add a schema version key to localStorage (`heyskipper_auth_version: "2"`). On mount, if stored user lacks expected JWT fields, clear localStorage and treat as logged out. Implement this guard **before** any JWT code ships.

**Detection:** Users report being logged out after a deploy; console 401 errors on authenticated endpoints.

**Phase:** Auth migration — implement version guard first.

---

### Pitfall 2: Orphaned WooCommerce Orders When Stripe Payment Fails Mid-Flow

**What goes wrong:** The checkout sequence is: (1) create WC order → (2) create Stripe intent → (3) confirm payment → (4) update order status. If step 3 fails (card declined, network timeout), a real WooCommerce order already exists as "pending" — stock may be reserved, customer has no email, no recovery path. No Stripe webhook handler exists in `server/index.cjs`.

**Consequences:** Ghost "pending" orders accumulate; potential inventory reservation errors; customers who retry create a second ghost order.

**Prevention:** Option A (minimal): Create WC order only after `paymentIntent.status === 'succeeded'`. Option B (correct): Add Stripe webhook handler to `server/index.cjs` that transitions WC orders on `payment_intent.succeeded`.

**Detection:** "Pending" orders in WooCommerce with no Stripe payment ID.

**Phase:** Payment hardening — before accepting real payments.

---

### Pitfall 3: Full Customer PII Stored in localStorage is Readable by Every Third-Party Script

**What goes wrong:** `AuthContext.tsx` line 101 writes the entire WooCommerce customer object — including `billing.address_1`, `billing.phone`, `billing.email` — to localStorage as plaintext. Every third-party script (Stamped.io, Emotive.io, Mailchimp) can read this data. XSS via a compromised CDN script can exfiltrate all logged-in users' billing data.

**Consequences:** Customer PII exposed to all third-party scripts; GDPR/CCPA compliance risk.

**Prevention:** Store only `{ id, email, first_name, last_name }` in localStorage. Fetch full profile fresh on Account page when needed. Fix simultaneously with JWT work.

**Detection:** Audit what's serialized at `localStorage.setItem('heyskipper_user', ...)` — if `billing` or `shipping` keys are present, it's vulnerable.

**Phase:** Auth migration — fix data scope at same time as JWT.

---

### Pitfall 4: Product ID Mismatch Silently Corrupts WooCommerce Order Line Items

**What goes wrong:** `utils/productMapper.ts` uses fuzzy name matching (`findLocalProduct`) to merge local seed data with WooCommerce products. At checkout, `CheckoutPage.tsx` sends `product_id: !isNaN(Number(item.id)) ? Number(item.id) : 0`. If IDs don't match, WooCommerce receives `product_id: 0`, creating a custom line item with no inventory linkage — stock is never decremented.

**Consequences:** Orders with `product_id: 0` — WC treats as custom items; potential overselling.

**Prevention:** After confirming WooCommerce integration, delete `data/products.ts` seed data and rely exclusively on live WC data. Add validation warning in `mapWooProductToAppProduct()` if `wpProduct.id` is undefined.

**Detection:** WooCommerce orders showing "Custom Product" line items with no SKU; stock levels unchanged after purchases.

**Phase:** Data integrity — before any real orders are processed.

---

### Pitfall 5: The Express Server Has No Implemented API Endpoints

**What goes wrong:** `server/index.cjs` contains only a health check. All endpoints that `services/api.ts` calls (`/api/login`, `/api/products`, `/api/create-order`, etc.) do not exist in the server file. Deploying from this repository alone results in 404 for all API-dependent features.

**Prevention:** Reconstruct or verify the full server implementation. This is a prerequisite for all other backend work.

**Detection:** `GET /api/products` returns 404; only `/api/health` works.

**Phase:** Infrastructure — must be resolved first, before all other phases.

---

## Moderate Pitfalls

### Pitfall 6: Third-Party Widget Script Errors Crash the Entire React App

No error boundaries exist in the component tree. Any uncaught error from Stamped.io, Emotive.io, or Mailchimp CDN scripts will unmount the entire app.

**Prevention:** Add `ErrorBoundary` components wrapping every third-party widget before integrating any external SDK. Load scripts with `async` — never synchronously.

**Phase:** Third-party integration — add error boundaries first.

---

### Pitfall 7: WooCommerce API Returns Only 10 Products by Default

`fetchProducts()` makes a single GET request. WooCommerce defaults to `per_page=10`. If HeySkipper has more than 10 active products, the storefront silently shows only the first 10 with no error.

**Prevention:** Set `per_page=100` (WC maximum) on the server-side WooCommerce API call. If catalog exceeds 100, implement pagination loop.

**Detection:** Product count in WC admin doesn't match storefront count; response headers show `X-WP-TotalPages: 2+`.

**Phase:** API integration validation — verify before staging deployment.

---

### Pitfall 8: Turnstile CAPTCHA Uses a Test Key That Always Passes

`CheckoutPage.tsx` has Cloudflare Turnstile site key hardcoded as `1x00000000000000000000AA` — the documented test key that always passes. Zero bot protection in production against carding attacks.

**Prevention:** Move to `VITE_TURNSTILE_SITE_KEY` env var. Register a production key in Cloudflare Turnstile. Add build-time check that rejects the test key value.

**Phase:** Security hardening — before production traffic.

---

### Pitfall 9: Large Components Degrade AI-Assisted Maintenance Accuracy

`CheckoutPage.tsx` is ~670 lines handling form state, Stripe, geocoding, shipping calc, order creation, and success screen. When the owner asks Claude to "change the rod shipping cost to $20," Claude must reason about the entire file to find one constant — increasing the chance of errors in unrelated sections.

**Prevention:** Split into `useShippingCalculator.ts`, `useCheckoutForm.ts`, `useStripePayment.ts`, `CheckoutFormStep.tsx`, `CheckoutSuccessStep.tsx`. Keep each file under 200 lines. Add a one-sentence purpose comment at the top of each file.

**Phase:** Code organization — do this before adding new features.

---

### Pitfall 10: Emotive.io Popup Is a Non-Functional Mock That Silently Discards Input

`EmotivePopup.tsx` renders a phone number form with `onSubmit={(e) => e.preventDefault()}`. Customers who submit their number receive no confirmation and no data is captured.

**Prevention:** Integrate the real Emotive.io SDK or remove the popup before launch. Do not ship a form that silently discards user input.

**Phase:** Third-party integration.

---

### Pitfall 11: `register()` Silently Calls `login()` — New Customer Accounts Never Created

`AuthContext.tsx` lines 114–118: `register()` calls `login()`. New customers attempting to create an account silently fail or log in with non-existent credentials.

**Prevention:** Implement `register()` using WooCommerce `POST /customers`, or remove the registration form and direct new customers to create accounts at checkout.

**Phase:** Auth migration.

---

## Minor Pitfalls

### Pitfall 12: Nominatim Geocoding Has No Rate Limit Protection

Nominatim (OpenStreetMap) requires max 1 request/second. Repeated calls under traffic result in 429 or IP ban. The map on the success screen adds no user value.

**Prevention:** Remove the map from the success screen, or cache geocoded results by zip code server-side.

**Phase:** Checkout refinement.

---

### Pitfall 13: CORS Allows All Origins on the Production API Server

`server/index.cjs` uses `cors()` with no options, allowing any origin to make browser requests to the backend.

**Prevention:** Configure with explicit allowlist: `cors({ origin: ['https://heyskipperfishing.com', 'https://staging.heyskipperfishing.com'] })`.

**Phase:** Security hardening.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Infrastructure setup | Server has no endpoints (P5) | Reconstruct server first — prerequisite |
| JWT auth migration | Stale localStorage breaks sessions (P1) | Version guard before JWT deploy |
| JWT auth migration | Full PII in localStorage (P3) | Scope stored data to identity fields only |
| JWT auth migration | `register()` maps to `login()` (P11) | Implement or disable registration |
| Data integrity | Product ID 0 in order line items (P4) | Validate IDs; remove seed data |
| API integration | WooCommerce pagination cuts off products (P7) | Set `per_page=100` server-side |
| Payment hardening | Ghost WC orders on payment failure (P2) | Add Stripe webhook before real payments |
| Security hardening | Turnstile test key (P8) | Env var + build-time check |
| Security hardening | CORS allows all origins (P13) | Allowlist production domains |
| Third-party widgets | Widget crashes unmount app (P6) | Error boundaries before any SDK |
| Third-party widgets | Emotive popup is a mock (P10) | Integrate or remove before launch |
| Code organization | Large files degrade AI edits (P9) | Split CheckoutPage before adding features |
| Checkout refinement | Geocoding rate limits (P12) | Cache by zip or remove success map |

---

## Recommended Phase Order Based on Pitfalls

1. **Infrastructure** — Reconstruct server endpoints (P5 is a blocker for everything)
2. **Security & Auth** — JWT + PII reduction + Turnstile (P1, P3, P8)
3. **Data integrity** — Product ID validation, remove seed data (P4)
4. **Payment hardening** — Stripe webhook (P2)
5. **Code organization** — Split CheckoutPage (P9, enables safer feature work)
6. **Third-party integrations** — With error boundaries first (P6, P10, P11)
7. **Features** — Landing pages, bento grid (no blockers once above are done)

---

## Open Questions

- Is the full server implementation hosted elsewhere (separate repo or server)? `server/index.cjs` stub suggests the real implementation may exist outside this repository.
- What WooCommerce JWT plugin is being used? (`jwt-authentication-for-wp-rest-api` vs `Simple JWT Login` have different token formats.)
- Does TitanHostingHub support Node.js processes, or does the frontend need to be served as static files only?

---

*Pitfalls research: 2026-03-02*
