---
phase: 05-analytics-and-third-party-integrations
plan: 03
subsystem: integrations
tags: [stamped-io, reviews, widget, carousel, analytics, ga4, ecommerce-events]

# Dependency graph
requires:
  - phase: 05-analytics-and-third-party-integrations
    provides: utils/analytics.ts with trackViewItem export, GA4 initialized in App.tsx

provides:
  - utils/stamped.ts — Stamped.io CDN script inject and StampedFn.init(), called once from App.tsx
  - ProductPage.tsx with hasReviews state, stamped-main-widget div, reloadUGC on product change, stamped:reviews:loaded listener, and trackViewItem on every product view
  - components/sections/StampedCarousel.tsx — homepage carousel widget with stamped-reviews-widget div
  - App.tsx wired to initStamped() on mount; StampedCarousel mounted in home view after Reviews

affects: [05-04, any future plan that extends ProductPage or homepage sections]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Stamped CDN inject pattern — script injected once on app mount via initStamped() with env var guard and duplicate-inject guard
    - hasReviews gate pattern — stamped widget container only renders after stamped:reviews:loaded fires with at least 1 review (no empty box flash)
    - reloadUGC pattern — useEffect([product.id]) calls StampedFn.reloadUGC() to reinitialize widget on product navigation without re-injecting CDN script

key-files:
  created:
    - utils/stamped.ts
    - components/sections/StampedCarousel.tsx
  modified:
    - components/pages/ProductPage.tsx
    - App.tsx

key-decisions:
  - "Stamped CDN script injected once in App.tsx initStamped(); ProductPage calls reloadUGC() not reinit — avoids duplicate script tags on product navigation"
  - "hasReviews state gates the widget div — stamped:reviews:loaded event with .stamped-review count check prevents empty widget box for zero-review products"
  - "product.categoryId ?? 'fishing' used for trackViewItem category — categoryId is optional on Product type, fishing is the correct fallback for this catalog"

patterns-established:
  - "Stamped CDN init pattern: initStamped() in App.tsx useEffect([]) — inject once, StampedFn.init() on script load"
  - "Per-product Stamped refresh: useEffect([product.id]) calls reloadUGC() — correct pattern for SPA product navigation"

requirements-completed: [INT-01, INT-02]

# Metrics
duration: 3min
completed: 2026-03-10
---

# Phase 5 Plan 03: Stamped.io Reviews Widget and Carousel Summary

**Stamped.io CDN script injected once via utils/stamped.ts, ProductPage shows reviews widget gated on stamped:reviews:loaded with reloadUGC on product navigation, and StampedCarousel component added to homepage below static Reviews section**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-10T18:32:36Z
- **Completed:** 2026-03-10T18:35:08Z
- **Tasks:** 2
- **Files modified:** 4 (created utils/stamped.ts, StampedCarousel.tsx; modified ProductPage.tsx, App.tsx)

## Accomplishments

- Created `utils/stamped.ts` — single Stamped.io integration point: env var guard (no-ops if VITE_STAMPED_API_KEY or VITE_STAMPED_STORE_HASH missing), duplicate-inject guard, StampedFn.init() called on script load
- Wired ProductPage with trackViewItem (GA4 view_item on every product view), hasReviews state gating the stamped-main-widget container, stamped:reviews:loaded listener, and reloadUGC() call — all keyed to product.id dependency
- Created StampedCarousel section component (stamped-reviews-widget carousel div); mounted in App.tsx home view after existing Reviews section

## Task Commits

Each task was committed atomically:

1. **Task 1: Create utils/stamped.ts and wire initStamped into App.tsx** - `52917f4` (feat)
2. **Task 2: Add Stamped reviews widget to ProductPage; create StampedCarousel** - `e86b324` (feat)

**Plan metadata:** committed in final docs commit

## Files Created/Modified

- `utils/stamped.ts` — Stamped.io CDN inject with initStamped() export; env var guard; duplicate-inject guard; StampedFn.init() on onload
- `components/sections/StampedCarousel.tsx` — homepage carousel section with stamped-reviews-widget div and descriptive comment
- `components/pages/ProductPage.tsx` — added trackViewItem import, hasReviews state, product-keyed useEffect with stamped:reviews:loaded listener and reloadUGC call, stamped-main-widget JSX gated on hasReviews
- `App.tsx` — added initStamped import and useEffect on mount; added StampedCarousel import and JSX in home view

## Decisions Made

- Stamped CDN script injected once in App.tsx initStamped(); ProductPage calls reloadUGC() not re-init — avoids duplicate script tags on product navigation
- hasReviews state gates the widget div — stamped:reviews:loaded event with .stamped-review count check prevents empty widget box for zero-review products; no spinner, no layout shift
- product.categoryId ?? 'fishing' used for trackViewItem category — categoryId is optional on the Product type, 'fishing' is the correct brand fallback for all HeySkipper products

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Pre-existing TypeScript errors in `components/ui/ErrorBoundary.tsx` and `hooks/useCheckoutSubmit.ts` were present before this plan and are unrelated to these changes (documented in 05-01 summary). Zero errors in the files touched by this plan.

## User Setup Required

**External services require manual configuration.** Two env vars must be set before Stamped reviews appear:

| Variable | Source |
|----------|--------|
| `VITE_STAMPED_API_KEY` | Stamped.io Dashboard -> Settings -> API Keys -> Public API Key |
| `VITE_STAMPED_STORE_HASH` | Stamped.io Dashboard -> Settings -> Store -> Store Hash |

Both are optional at build time — missing values cause initStamped() to silently no-op (guard in place). Reviews widget and carousel will not render without a valid Stamped account.

## Next Phase Readiness

- Stamped.io integration fully wired — pending live account credentials in .env.local for end-to-end testing
- All GA4 ecommerce tracking wired (trackViewItem fires on every ProductPage mount)
- Phase 5 complete — ready for Phase 6 planning

---
*Phase: 05-analytics-and-third-party-integrations*
*Completed: 2026-03-10*
