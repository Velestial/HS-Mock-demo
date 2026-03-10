---
phase: 05-analytics-and-third-party-integrations
plan: 02
subsystem: analytics
tags: [ga4, google-analytics, ecommerce-events, add_to_cart, remove_from_cart, begin_checkout, purchase, stripe]

# Dependency graph
requires:
  - phase: 05-analytics-and-third-party-integrations
    provides: utils/analytics.ts with trackAddToCart, trackRemoveFromCart, trackBeginCheckout, trackPurchase exports

provides:
  - trackAddToCart wired in CartContext.addToCart — fires on every cart add
  - trackRemoveFromCart wired in CartSidebar remove button — fires before removeFromCart call
  - trackBeginCheckout wired in CheckoutPage via useEffect on mount — fires once with full cart
  - trackPurchase wired in useCheckoutSubmit inside paymentIntent.status === 'succeeded' block only

affects: [marketing analytics, GA4 ecommerce funnel reports, conversion tracking]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - GA4 ecommerce call sites — each event fires at the exact moment the user action occurs (not on intent)
    - trackPurchase gating — purchase event only fires after Stripe confirmed AND WC order updated; never fired speculatively
    - useEffect(fn, []) for begin_checkout — ensures single fire on checkout page mount, not on re-renders

key-files:
  created: []
  modified:
    - context/CartContext.tsx
    - components/widgets/CartSidebar.tsx
    - components/pages/CheckoutPage.tsx
    - hooks/useCheckoutSubmit.ts

key-decisions:
  - "trackAddToCart fires with quantity 1 per add-to-cart action — standard GA4 ecommerce behavior even if item already exists in cart"
  - "trackPurchase placed after updateOrderStatus, before geocoding try/catch — fires only in the succeeded block, never in catch or outside the conditional"
  - "useEffect(fn, []) for begin_checkout — empty dep array fires once on mount; items and cartTotal captured at checkout entry point"

patterns-established:
  - "GA4 ecommerce call site pattern: import named export from utils/analytics.ts, call at exact user action point — no direct window.gtag calls in components"

requirements-completed: [ANLT-02, ANLT-03]

# Metrics
duration: 2min
completed: 2026-03-10
---

# Phase 5 Plan 02: GA4 Ecommerce Event Wiring Summary

**Four GA4 ecommerce events (add_to_cart, remove_from_cart, begin_checkout, purchase) wired into CartContext, CartSidebar, CheckoutPage, and useCheckoutSubmit — completing the full funnel from cart add to Stripe-confirmed purchase**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-10T18:32:35Z
- **Completed:** 2026-03-10T18:34:51Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- `CartContext.addToCart` now calls `trackAddToCart` after `setItems` — fires with item id, name, price, category, quantity 1 per add action
- `CartSidebar` remove button now calls `trackRemoveFromCart` with item's current quantity before calling `removeFromCart(item.id)`
- `CheckoutPage` fires `trackBeginCheckout` once on mount via `useEffect(fn, [])` — maps cart items to GA4Item format, passes cartTotal as value
- `useCheckoutSubmit` fires `trackPurchase` inside `if (result.paymentIntent?.status === 'succeeded')` block after `updateOrderStatus` succeeds — transaction_id, finalTotal, ga4Items, shippingCost, taxAmount all passed

## Task Commits

Each task was committed atomically:

1. **Task 1: add_to_cart and remove_from_cart events** - `6ad2c68` (feat)
2. **Task 2: begin_checkout and purchase events** - `f55898e` (feat)

**Plan metadata:** committed in final docs commit

## Files Created/Modified

- `context/CartContext.tsx` — added `trackAddToCart` import and call inside `addToCart` after `setItems`
- `components/widgets/CartSidebar.tsx` — added `trackRemoveFromCart` import; wrapped remove button onClick to fire event before `removeFromCart`
- `components/pages/CheckoutPage.tsx` — added `trackBeginCheckout` import and `useEffect` on mount that maps items to GA4Item format
- `hooks/useCheckoutSubmit.ts` — added `trackPurchase` import and call inside the `paymentIntent.status === 'succeeded'` block

## Decisions Made

- `trackAddToCart` always fires with `quantity: 1` regardless of whether item already existed in cart — this is correct GA4 ecommerce behavior (tracks the add action, not the resulting cart state)
- `trackPurchase` placed after `updateOrderStatus` but before the geocoding `try/catch` — fires only when both Stripe and WC order update have succeeded, never in error paths
- `useEffect(fn, [])` with no deps for `begin_checkout` — captures items and cartTotal at the moment the checkout page renders; React will warn about stale closure but this is intentional for a one-shot event

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Pre-existing TypeScript errors in `components/ui/ErrorBoundary.tsx` (property `state`/`setState`/`props` on ErrorBoundary class) and `hooks/useCheckoutSubmit.ts` (line 43: `Cannot find namespace 'React'`) were present before this plan. Zero new errors in files modified by this plan. Build passes cleanly.

## User Setup Required

None - no new external service configuration required. GA4 Measurement ID configured in 05-01.

## Next Phase Readiness

- All 4 GA4 ecommerce events are instrumented — full browse-to-purchase funnel is trackable
- GA4 ecommerce reports (funnel exploration, purchase path) will populate once `VITE_GA4_MEASUREMENT_ID` is set in production
- Ready for 05-03 (remaining third-party integrations: Stamped.io reviews, Mailchimp email signup)

## Self-Check

- `context/CartContext.tsx` exists: FOUND
- `components/widgets/CartSidebar.tsx` exists: FOUND
- `components/pages/CheckoutPage.tsx` exists: FOUND
- `hooks/useCheckoutSubmit.ts` exists: FOUND
- Task 1 commit 6ad2c68: FOUND
- Task 2 commit f55898e: FOUND
- Build passes: CONFIRMED

## Self-Check: PASSED

---
*Phase: 05-analytics-and-third-party-integrations*
*Completed: 2026-03-10*
