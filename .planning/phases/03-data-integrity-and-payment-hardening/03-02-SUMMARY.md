---
phase: 03-data-integrity-and-payment-hardening
plan: "02"
subsystem: payment
tags: [stripe, turnstile, cents-conversion, env-vars]
dependency_graph:
  requires: []
  provides: [correct-stripe-amount, production-turnstile-key]
  affects: [components/CheckoutPage.tsx, services/api.ts, components/LoginPage.tsx]
tech_stack:
  added: []
  patterns: [dollars-to-cents-at-api-layer, env-var-with-fallback]
key_files:
  created: []
  modified:
    - services/api.ts
    - components/CheckoutPage.tsx
    - components/LoginPage.tsx
decisions:
  - Cents conversion at API layer (not server) keeps server simple and consistent
  - Test key fallback ensures dev environment still works without env var set
metrics:
  duration: ~5min
  completed: 2026-03-09
---

# Phase 03 Plan 02: Payment Amount and Production Turnstile Summary

**Status**: Complete
**Date**: 2026-03-09

**One-liner**: Fixed Stripe amount bug (dollars-to-cents via Math.round * 100) and wired Turnstile to VITE_TURNSTILE_SITE_KEY env var with test-key fallback across CheckoutPage and LoginPage.

## What was done

- `createPaymentIntent` converts dollar amounts to cents before sending to Stripe — a $42.99 order now correctly creates a PaymentIntent for 4299 cents instead of 43 cents
- `createPaymentIntent` signature extended to accept optional `wcOrderId` parameter for future webhook linking in plan 03-03
- `CheckoutPage.tsx` Turnstile widget now reads from `VITE_TURNSTILE_SITE_KEY` env var with test key fallback
- `LoginPage.tsx` Turnstile widget already referenced `VITE_TURNSTILE_SITE_KEY`; test-key fallback added for parity

## Key decisions

- Cents conversion at API layer (not server) — keeps the Express server simple; it receives an integer and passes it directly to Stripe
- Test key fallback (`|| '1x00000000000000000000AA'`) ensures local dev still renders Turnstile without requiring the env var to be set

## Files changed

- `services/api.ts` — cents conversion via `Math.round(amount * 100)`, added optional `wcOrderId` parameter
- `components/CheckoutPage.tsx` — Turnstile `siteKey` reads from `VITE_TURNSTILE_SITE_KEY` env var
- `components/LoginPage.tsx` — added test-key fallback to existing env var reference

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing] Added test-key fallback to LoginPage Turnstile**
- **Found during:** Task 3
- **Issue:** LoginPage already used `import.meta.env.VITE_TURNSTILE_SITE_KEY` but had no fallback — Turnstile would fail to render in dev environments without the env var set
- **Fix:** Added `|| '1x00000000000000000000AA'` fallback, consistent with the CheckoutPage fix

## Notes

All three changes were already present in commit `4af30c5` (merged during 03-01 execution). The plan's requirements PAY-01, PAY-02, PAY-03 are fully satisfied.

## Self-Check: PASSED

- `services/api.ts` contains `Math.round(amount * 100)` — VERIFIED
- `components/CheckoutPage.tsx` contains `import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'` — VERIFIED
- `components/LoginPage.tsx` contains `import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'` — VERIFIED
- Build passes (`npm run build` exits 0) — VERIFIED
- Commit `4af30c5` contains all changes — VERIFIED
