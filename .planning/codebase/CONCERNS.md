# Technical Concerns

**Analysis Date:** 2026-03-02

## Tech Debt

### 1. Demo Authentication — CRITICAL
- **Location:** `context/AuthContext.tsx:87-88`, `services/api.ts:37-44`
- **Issue:** Password is explicitly ignored. Login is email-only "magic link" style. Comment reads: "Password is ignored for this 'Magic Link' / 'Email Match' style demo login"
- **Risk:** Production deployment with this auth would allow anyone knowing an email to log in
- **Fix Required:** Real JWT/OAuth authentication before going live

### 2. Pervasive `any` Typing
- **Location:** `services/api.ts` (orderData: any, data: any), `context/AuthContext.tsx` (orders?: any[])
- **Issue:** Multiple API functions accept/return `any` — no type safety for API payloads
- **Risk:** Runtime errors from malformed API responses, no IDE autocomplete, brittle refactoring
- **Fix:** Define typed request/response interfaces for all API calls

### 3. `register()` Maps to `login()`
- **Location:** `context/AuthContext.tsx:114-119`
- **Issue:** Registration function just calls login. Comment: "For now, registration maps to Login"
- **Risk:** New users cannot create accounts — broken user journey
- **Fix:** Implement actual WooCommerce customer creation endpoint

### 4. Two Entry Points
- **Location:** `index.tsx` and `main.tsx` both exist at root
- **Issue:** Unclear which is canonical. Likely `main.tsx` is active but `index.tsx` creates confusion
- **Risk:** Wrong file edited during maintenance; bundler may behave unexpectedly
- **Fix:** Remove or clearly deprecate `index.tsx`

### 5. Debug/Test Scripts at Root
- **Location:** `debug_api.js`, `test_mapper.js`, `test_mapper.ts`
- **Issue:** Loose debug scripts committed to root, not in a test directory
- **Risk:** Confusion about project structure; accidental inclusion in build
- **Fix:** Delete or move to a `scripts/` directory with clear purpose

### 6. `dist/` Directory Committed
- **Location:** `dist/`
- **Issue:** Build output committed alongside source
- **Risk:** Stale builds in version control, large diffs on every build
- **Fix:** Add `dist/` to `.gitignore`

### 7. Large CheckoutPage Component
- **Location:** `components/CheckoutPage.tsx` (~670 lines)
- **Issue:** Single component handling multiple checkout steps, Stripe integration, geocoding, shipping logic, form validation
- **Risk:** Difficult to maintain, test, or modify individual steps
- **Fix:** Extract into step components and custom hooks

## Known Bugs

### 1. Geocoding Latency in Checkout
- **Location:** `components/CheckoutPage.tsx`
- **Issue:** Geocoding API call for map display can fail silently; fallback behavior unclear
- **Risk:** Map fails to load without user feedback; checkout may proceed with stale coordinates

### 2. Product ID Mismatch Between Local and WooCommerce
- **Location:** `utils/productMapper.ts`, `data/products.ts`
- **Issue:** Local seed data (`data/products.ts`) and WooCommerce products may have mismatched IDs
- **Risk:** `findLocalProduct()` returns wrong product; cart items may display incorrect data

### 3. Silent Cart Failure on localStorage Parse Error
- **Location:** `context/CartContext.tsx`
- **Issue:** If localStorage cart data is corrupted, cart silently resets to empty — no user feedback
- **Risk:** Customer loses cart without explanation

## Security Concerns

### 1. User Data in localStorage Plaintext — HIGH
- **Location:** `context/AuthContext.tsx:101`
- **Issue:** Full WooCommerce customer object (name, email, billing address) stored in localStorage as plaintext
- **Risk:** XSS attacks can exfiltrate PII; any JS on the page can read customer data
- **Mitigation:** Minimize stored data; use httpOnly cookies for session tokens instead

### 2. No CSRF Protection
- **Location:** `server/index.cjs`
- **Issue:** Express server has no CSRF tokens or same-site cookie policies
- **Risk:** Cross-site request forgery on order creation and payment endpoints

### 3. API Keys in Version Control
- **Location:** `.env.keys`, `server/.env.keys`
- **Issue:** Key files present in repository (even if encrypted/gitignored, their existence is notable)
- **Risk:** Accidental commit of real credentials; key rotation complexity
- **Action:** Verify these are in `.gitignore` and not committed with real values

### 4. No Input Validation on Server
- **Location:** `server/index.cjs`
- **Issue:** API endpoints accept raw client payloads and proxy to WooCommerce without validation
- **Risk:** Malformed requests, injection attempts, oversized payloads

### 5. Stripe Secret Key on Server
- **Location:** `server/index.cjs`, `server/.env`
- **Issue:** Stripe secret key stored in server `.env` — standard practice but `.env` must never be committed
- **Action:** Verify `server/.env` is in `.gitignore`

## Performance Bottlenecks

### 1. Geocoding on Every Checkout Render
- **Location:** `components/CheckoutPage.tsx`
- **Issue:** Geocoding API called without caching; re-triggers on address changes
- **Risk:** Slow checkout UX; unnecessary API calls; potential rate limiting

### 2. No Product Caching
- **Location:** `context/ProductContext.tsx`
- **Issue:** Products fetched fresh on every app mount; no cache TTL or stale-while-revalidate
- **Risk:** Unnecessary WooCommerce API load; slow initial render on every visit

### 3. All Images at Original Resolution
- **Location:** `public/`, `assets/`
- **Issue:** Rod and product images served without resizing or WebP conversion
- **Risk:** Large page weight; slow load on mobile

## Fragile Areas

### 1. Stripe Integration
- **Location:** `components/CheckoutPage.tsx`, `services/api.ts`
- **Why fragile:** Payment flow spans multiple async steps (intent creation → confirmation → order update); any step failure can leave orders in inconsistent state
- **Caution:** Changes here require full checkout flow testing

### 2. WooCommerce API Dependency
- **Location:** `services/api.ts`, `server/index.cjs`
- **Why fragile:** All product, order, and customer data flows through WooCommerce; API shape changes break the entire app
- **Caution:** `mapWooProductToAppProduct()` in `utils/productMapper.ts` is the critical transformation layer

### 3. Cart ↔ WooCommerce Order Sync
- **Location:** `context/CartContext.tsx`, `components/CheckoutPage.tsx`
- **Why fragile:** Cart items use local IDs; checkout must correctly map to WooCommerce product IDs for order creation
- **Caution:** ID mapping via `findLocalProduct()` is brittle if product names change

### 4. LocalStorage as Auth Session
- **Location:** `context/AuthContext.tsx`
- **Why fragile:** localStorage is synchronous, shared across tabs, and can be cleared by browser at any time
- **Caution:** Tab sync issues possible (login in one tab doesn't propagate to others)

## Missing Critical Features

| Feature | Risk if Missing |
|---------|----------------|
| Real authentication | Any email can log in as any customer |
| Error boundaries | Uncaught errors crash entire app |
| Loading states in ProductContext | Components render before data is ready |
| Order confirmation / receipt email | Customers have no post-purchase confirmation |
| Retry logic for failed API calls | Transient network errors silently fail |
| Form validation feedback | Users don't know why checkout submission failed |

## Dependencies at Risk

| Dependency | Risk |
|-----------|------|
| WooCommerce REST API | Single point of failure for products, orders, customers |
| Stripe | Payment processing; API breaking changes require immediate response |
| Mapbox/Leaflet (geocoding) | Checkout map feature depends on external service availability |

---

*Concerns analysis: 2026-03-02*
