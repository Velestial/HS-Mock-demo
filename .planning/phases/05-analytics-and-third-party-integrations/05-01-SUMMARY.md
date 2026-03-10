---
phase: 05-analytics-and-third-party-integrations
plan: 01
subsystem: analytics
tags: [ga4, google-analytics, emotive, sms, tracking, ecommerce-events]

# Dependency graph
requires:
  - phase: 04-code-quality-and-ui-foundations
    provides: App.tsx with ErrorBoundary wrapping all views, component organization established

provides:
  - utils/analytics.ts — typed GA4 init and 7 ecommerce event tracking functions
  - GA4 initialization on app mount via initGA() in App.tsx
  - page_view tracking on every view state change via trackPageView() in App.tsx
  - Emotive SMS popup iframe injected after 5-second delay via useEffect in App.tsx
  - EmotivePopup.tsx mock fully deleted — no custom popup UI

affects: [05-02, 05-03, any component that calls trackAddToCart/trackPurchase/trackViewItem]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - GA4 analytics module pattern — all gtag calls routed through utils/analytics.ts (never called directly in components)
    - Regular function for window.gtag (not arrow) — required for Arguments object; arrow functions break GA4
    - send_page_view: false on GA4 config — App.tsx fires page_view manually to prevent double-count
    - Third-party SDK injection pattern — useEffect with setTimeout delay, getElementById duplicate guard, empty dep array

key-files:
  created:
    - utils/analytics.ts
  modified:
    - App.tsx

key-decisions:
  - "GA4 gtag must be a regular function (not arrow) — arrow functions create true Arrays; GA4 requires the Arguments object"
  - "Emotive embed is an iframe URL (HTML page), not a JS script — injected as <iframe> not <script>"
  - "send_page_view: false on GA4 config — prevents double page_view; App.tsx fires the first view manually via useEffect"
  - "initGA() guards on !window.gtag to prevent double-inject on hot reload"
  - "trackPurchase() must only be called after paymentIntent.status === 'succeeded' — documented in function comment"

patterns-established:
  - "Analytics module pattern: all GA4 calls go through utils/analytics.ts exports — components never call window.gtag directly"
  - "SDK inject pattern: useEffect + setTimeout(5000) + getElementById guard + empty dep array — reuse for any future third-party SDK"

requirements-completed: [ANLT-01, INT-03, INT-04]

# Metrics
duration: 3min
completed: 2026-03-10
---

# Phase 5 Plan 01: GA4 Analytics Module and Emotive SDK Embed Summary

**Typed GA4 analytics module (utils/analytics.ts) with 7 ecommerce event exports, wired into App.tsx for mount-time init and per-view page_view tracking, plus Emotive SMS popup via delayed iframe inject replacing the deleted EmotivePopup.tsx mock**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-10T18:26:58Z
- **Completed:** 2026-03-10T18:29:31Z
- **Tasks:** 2
- **Files modified:** 3 (created utils/analytics.ts, modified App.tsx, deleted EmotivePopup.tsx)

## Accomplishments

- Created `utils/analytics.ts` — single GA4 integration point with initGA, trackPageView, trackViewItem, trackAddToCart, trackRemoveFromCart, trackBeginCheckout, trackPurchase; inline Window type augmentation; no devDependency
- Wired GA4 into App.tsx: initGA() on mount, trackPageView() on every view state change with a full 15-view title map
- Replaced non-functional EmotivePopup.tsx mock with real Emotive SDK iframe inject (5s delay, duplicate-inject guard, empty dep array); EmotivePopup.tsx fully deleted

## Task Commits

Each task was committed atomically:

1. **Task 1: Create utils/analytics.ts** - `a893b09` (feat)
2. **Task 2: Wire App.tsx + delete EmotivePopup** - `e26fa83` (feat)

**Plan metadata:** committed in final docs commit

## Files Created/Modified

- `utils/analytics.ts` — GA4 init and 7 typed ecommerce tracking functions; inline Window declare global
- `App.tsx` — GA4 init useEffect, page_view tracking useEffect, Emotive iframe inject useEffect; EmotivePopup import and JSX removed
- `components/widgets/EmotivePopup.tsx` — deleted

## Decisions Made

- GA4 gtag initialized as a regular function (`function() { window.dataLayer.push(arguments); }`) not an arrow function — arrow functions break GA4 because they don't have the `arguments` object
- Emotive embed is an iframe, not a script tag (per user override instruction) — `VITE_EMOTIVE_SCRIPT_URL` is an HTML page URL, injected as `<iframe>` with `pointer-events:none` on the iframe itself
- `send_page_view: false` on GA4 config prevents the automatic page_view GA4 fires on config; App.tsx fires the first one manually so timing is predictable
- Inline `declare global` Window type augmentation chosen over `@types/gtag.js` to avoid a devDependency

## Deviations from Plan

**1. [User Override] Emotive embed implemented as iframe instead of script tag**
- **Found during:** Task 2 (Part B)
- **Issue:** Plan specified `document.createElement('script')` but user instruction states VITE_EMOTIVE_SCRIPT_URL is an iframe URL (HTML page), not a JS script
- **Fix:** Created `<iframe>` element instead of `<script>` element; used `getElementById('emotive-popup-iframe')` as duplicate-inject guard instead of `querySelector script[src]`
- **Files modified:** App.tsx
- **Verification:** Build passes; App.tsx contains VITE_EMOTIVE_SCRIPT_URL and iframe createElement pattern
- **Committed in:** e26fa83 (Task 2 commit)

---

**Total deviations:** 1 user-directed override (iframe vs script)
**Impact on plan:** Required change — plan had wrong element type for the Emotive URL format. No scope creep.

## Issues Encountered

Pre-existing TypeScript errors in `components/ui/ErrorBoundary.tsx` and `hooks/useCheckoutSubmit.ts` were present before this plan and are not caused by these changes. Zero errors in the files touched by this plan.

## User Setup Required

**External services require manual configuration.** Two env vars must be set before analytics and SMS opt-in are active in production:

| Variable | Source |
|----------|--------|
| `VITE_GA4_MEASUREMENT_ID` | GA4 Admin -> Data Streams -> your stream -> Measurement ID (format: G-XXXXXXXXXX) |
| `VITE_EMOTIVE_SCRIPT_URL` | Emotive Dashboard -> Integrations -> Custom/Non-Shopify embed -> copy the iframe src URL |

Both are optional at build time — missing values cause initGA() and the Emotive inject to silently no-op (guards in place).

## Next Phase Readiness

- `utils/analytics.ts` is ready for 05-02 (ecommerce event wiring — trackAddToCart, trackViewItem, trackBeginCheckout)
- `trackPurchase` ready for 05-03 (post-Stripe-confirmation call in CheckoutPage)
- Emotive SMS popup fully replaced — no further EmotivePopup work needed

---
*Phase: 05-analytics-and-third-party-integrations*
*Completed: 2026-03-10*
