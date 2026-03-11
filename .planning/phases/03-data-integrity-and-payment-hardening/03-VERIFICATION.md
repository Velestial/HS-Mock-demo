---
phase: 03-data-integrity-and-payment-hardening
verified: 2026-03-09T00:00:00Z
status: gaps_found
score: 3/4 success criteria verified
gaps:
  - truth: "A simulated failed Stripe payment does not leave a pending WooCommerce order behind"
    status: failed
    reason: "The webhook only handles payment_intent.succeeded. There is no handler for payment_intent.payment_failed. The checkout client creates a WC order (set_paid: false) then, if stripe.confirmCardPayment returns an error, it resets the form without cancelling or voiding the WC order. The pending order is never cleaned up."
    artifacts:
      - path: "server/routes/payments.cjs"
        issue: "No payment_intent.payment_failed handler in the stripe-webhook route — only payment_intent.succeeded is handled"
      - path: "components/CheckoutPage.tsx"
        issue: "In the catch block (lines 216-222), the code calls setStep('form') but never calls updateOrderStatus(order.id, 'cancelled') to clean up the WC order created in step 1"
    missing:
      - "Add a payment_intent.payment_failed event handler in server/routes/payments.cjs that sets the WC order status to 'cancelled'"
      - "OR: in CheckoutPage.tsx catch block, call updateOrderStatus(order.id, 'cancelled') before resetting the form — client-side fallback in case webhook is not wired up"
human_verification:
  - test: "Set VITE_TURNSTILE_SITE_KEY to the production Cloudflare Turnstile site key in .env and load the checkout page"
    expected: "The Turnstile widget renders with the production key, completing bot protection (not the always-pass test key)"
    why_human: "Cannot verify the env var contains the real production key from the codebase — only the fallback default (test key) is visible in source code"
---

# Phase 3: Data Integrity and Payment Hardening — Verification Report

**Phase Goal:** Every order placed carries correct WooCommerce product IDs and is only marked paid after Stripe confirms the charge, and the production Turnstile CAPTCHA is active.
**Verified:** 2026-03-09
**Status:** GAPS FOUND — 1 of 4 success criteria fails
**Re-verification:** No — initial verification

---

## Success Criteria Verification

### Criterion 1: All products in the catalog are visible (full catalog, not truncated at 10 items)

**Status: PASS**

Evidence:
- `server/routes/products.cjs` line 6: `api.get('products', { per_page: 100, status: 'publish' })` — explicitly requests up to 100 products instead of the default 10.
- `context/ProductContext.tsx` calls `fetchProducts()` and stores the result directly with `setProducts(serverProducts)` — no client-side truncation.
- `services/api.ts` `fetchProducts()` hits `/api/products` which routes to the server file above.

---

### Criterion 2: Adding an item to cart and checking out creates a WooCommerce order with the correct numeric product ID in the line item

**Status: PASS**

Evidence:
- `server/routes/products.cjs` `shapeProduct()` function (line 12): `id: String(wc.id)` — preserves the real WooCommerce numeric ID as a string.
- `context/ProductContext.tsx` stores server-shaped products directly without calling `mapWooProductToAppProduct`. The old double-mapping that would have corrupted IDs has been removed.
- `components/CheckoutPage.tsx` line 138: `product_id: !isNaN(Number(item.id)) ? Number(item.id) : 0` — converts the string ID back to a number for WooCommerce. Because the server now returns the real WC numeric ID (e.g., `"123"`), `Number("123")` resolves to `123`, not `0`.
- `mapWooProductToAppProduct` in `utils/productMapper.ts` is no longer called anywhere in the active product data pipeline. Its only runtime callers are test files (`test_mapper.js`, `test_mapper.ts`).

---

### Criterion 3: A simulated failed Stripe payment does not leave a "pending" WooCommerce order behind

**Status: FAIL**

The checkout flow creates a WooCommerce order (status: pending) BEFORE charging the card. If the Stripe charge fails, the order is never cleaned up.

**Webhook gap:** `server/routes/payments.cjs` handles only `payment_intent.succeeded` (line 33). There is no `payment_intent.payment_failed` handler. A failed payment generates no server-side cleanup.

**Client-side gap:** `components/CheckoutPage.tsx` catch block (lines 216–222) calls `setStep('form')` and displays the error but does NOT call `updateOrderStatus(order.id, 'cancelled')`. The pending WC order is orphaned.

**Impact:** Every failed checkout attempt creates an abandoned "pending" order in WooCommerce that will not automatically resolve. This misrepresents order volume and requires manual cleanup.

---

### Criterion 4: Checkout page uses the production Cloudflare Turnstile key (bot protection is active)

**Status: PASS (with human verification required)**

Evidence:
- `components/CheckoutPage.tsx` line 579: `siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}` — reads from the `VITE_TURNSTILE_SITE_KEY` environment variable.
- `components/LoginPage.tsx` line 140: same pattern with the same env var and test-key fallback.
- The code correctly reads the production key from the environment variable. Whether the actual `.env` file contains the real Cloudflare production key cannot be verified from the source code alone.

**Human verification required:** Confirm that `VITE_TURNSTILE_SITE_KEY` in the production/staging `.env` is set to the real Cloudflare Turnstile site key, not the always-pass test key `1x00000000000000000000AA`.

---

## Required Artifacts Status

| Artifact | Check | Status | Detail |
| --- | --- | --- | --- |
| `server/routes/products.cjs` | `per_page: 100` | VERIFIED | Line 6 |
| `context/ProductContext.tsx` | No `mapWooProductToAppProduct` call | VERIFIED | Stores server data directly |
| `components/ShopPage.tsx` | Uses `useProducts()` not seed data | VERIFIED | Line 30 |
| `components/Navbar.tsx` | Uses `useProducts()` not seed data | VERIFIED | Line 37 |
| `services/api.ts` | `createPaymentIntent` converts to cents AND accepts `wcOrderId` | VERIFIED | Lines 40–43 |
| `components/CheckoutPage.tsx` | Turnstile uses env var, `createPaymentIntent` called with `order.id` | VERIFIED | Lines 158, 579 |
| `server/routes/payments.cjs` | `/stripe-webhook` route AND `wc_order_id` in metadata | PARTIAL — webhook exists, metadata exists, but no failure handler | Lines 11, 16 |
| `utils/productMapper.ts` | Not called in live product pipeline | VERIFIED | Only referenced in test files |

---

## Key Link Verification

| From | To | Via | Status | Detail |
| --- | --- | --- | --- | --- |
| `CheckoutPage.tsx` | `/api/create-order` | `createOrder()` in `services/api.ts` | WIRED | Line 153 |
| `CheckoutPage.tsx` | `createPaymentIntent(finalTotal, order.id)` | `services/api.ts` | WIRED | Line 158 — passes WC order ID |
| `services/api.ts` | `/api/create-payment-intent` | axios POST | WIRED | Lines 40–44 — cents conversion + wcOrderId |
| `server/routes/payments.cjs` | Stripe PaymentIntent metadata | `wc_order_id` field | WIRED | Line 11 |
| `server/routes/payments.cjs` | WooCommerce order update on success | `payment_intent.succeeded` handler | WIRED | Lines 33–49 |
| `server/routes/payments.cjs` | WooCommerce order cancel on failure | `payment_intent.payment_failed` handler | NOT_WIRED | Handler does not exist |
| `CheckoutPage.tsx` catch block | Cancel WC order on Stripe failure | `updateOrderStatus(order.id, 'cancelled')` | NOT_WIRED | Lines 216–222 reset form only |

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| `components/CheckoutPage.tsx` | 138 | `product_id: ... 0` fallback | Warning | If a product somehow has a non-numeric ID, it silently sends `product_id: 0` creating a custom line item — acceptable given server now always returns numeric IDs |
| `components/CheckoutPage.tsx` | 256 | `Math.random()` for order reference number | Info | Success page shows a random reference not tied to the real WC order ID — cosmetic only |
| `server/routes/payments.cjs` | 47–48 | Returns 200 on WC update failure | Info | By design (prevents Stripe retry); error is logged |

---

## Human Verification Required

### 1. Production Turnstile Key Active

**Test:** Set `VITE_TURNSTILE_SITE_KEY` in `.env` to the Cloudflare production site key and load the checkout and login pages in a browser.
**Expected:** The Turnstile widget renders and challenges real users (not the always-pass test widget).
**Why human:** The source code only shows the env var read correctly — the actual key value lives outside the codebase.

---

## Gaps Summary

One gap blocks full goal achievement:

**Failed payments leave orphaned pending WC orders.** The payment flow creates a WooCommerce order before charging. If Stripe rejects the card, neither the webhook (no `payment_intent.payment_failed` handler) nor the client (no `updateOrderStatus` call in the catch block) cleans up the pending order. This contradicts the phase goal that orders are "only marked paid after Stripe confirms."

The three other success criteria are fully satisfied: full catalog loads with `per_page: 100`, products carry correct WC numeric IDs through the entire pipeline, and Turnstile is wired to read the production key from the environment variable.

---

## Overall Verdict: FAIL

3 of 4 success criteria pass. The failed-payment cleanup gap must be resolved before this phase can be marked complete.

---

_Verified: 2026-03-09_
_Verifier: Claude (gsd-verifier)_
