---
phase: 01-infrastructure
plan: 01
subsystem: infra
tags: [express, cors, morgan, woocommerce, stripe, nodemon, concurrently]

# Dependency graph
requires: []
provides:
  - Express 5 proxy server with startup env guard and named-variable exit on missing config
  - Dynamic CORS allowlist with credentials:true for Phase 2 httpOnly cookie auth
  - GET /api/health returning {status, timestamp}
  - GET /api/products proxying WooCommerce with per_page=100 and product shaping
  - POST /api/create-order, POST /api/update-order via WooCommerce API
  - POST /api/login, GET/PUT /api/customer/:id routes (PII-stripped customer data)
  - POST /api/create-payment-intent via Stripe paymentIntents.create()
  - POST /api/auth/login, /auth/refresh, /auth/logout returning 501 stubs for Phase 2
  - Morgan request logging (dev format in development, combined in production)
  - Normalized error shape {error, code, message} via errorHandler middleware
  - npm run dev starts both Vite and Express via concurrently + nodemon
  - server/.env.example with all required env var names and placeholder values
affects:
  - 02-auth
  - 03-payments
  - 04-cart

# Tech tracking
tech-stack:
  added: [morgan, concurrently, nodemon, @types/morgan]
  patterns:
    - Express 5 async handlers with no try/catch (rejected promises auto-forward to error handler)
    - Dynamic CORS origin callback (not open wildcard) with credentials:true
    - Startup env guard with process.exit(1) and named missing variables
    - PII stripping on customer endpoint (id, email, first_name, last_name only)
    - Shared WooCommerce client singleton in server/woocommerce.cjs
    - Normalized error shape {error:true, code, message} for all route errors

key-files:
  created:
    - server/index.cjs
    - server/woocommerce.cjs
    - server/middleware/errorHandler.cjs
    - server/routes/health.cjs
    - server/routes/products.cjs
    - server/routes/orders.cjs
    - server/routes/customers.cjs
    - server/routes/payments.cjs
    - server/routes/auth.cjs
    - server/.env.example
  modified:
    - package.json
    - .gitignore

key-decisions:
  - "Dynamic CORS origin callback used instead of open wildcard — credentials:true requires explicit origin matching per browser spec"
  - "Express 5 async handlers with no try/catch — unhandled promise rejections auto-forward to error handler in Express 5"
  - "per_page:100 hardcoded in products route per DATA-01 requirement — must not be reduced"
  - "PII stripping on GET /customer/:id established now (Phase 1) even though auth is Phase 2 — safe pattern from AUTH-06"
  - "Auth routes return 501 Not Implemented (not 404) to indicate planned but not-yet-implemented endpoints"

patterns-established:
  - "Env guard pattern: REQUIRED_ENV array filtered before any other code runs, exits with named missing vars"
  - "Route files: all .cjs CommonJS modules with Express Router, no try/catch (Express 5 async)"
  - "WooCommerce client: shared singleton from server/woocommerce.cjs, required in each route file"
  - "Error handler: 4-param signature (err, req, res, next) mounted last in server/index.cjs"

requirements-completed: [INFRA-01, INFRA-03]

# Metrics
duration: 15min
completed: 2026-03-05
---

# Phase 1 Plan 01: Express Proxy Server Summary

**Express 5 proxy server with startup env guard, dynamic CORS allowlist, 10 proxy routes (WooCommerce + Stripe), Phase 2 JWT stubs, and concurrently dev workflow**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-05T07:11:47Z
- **Completed:** 2026-03-05T07:17:00Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments

- Replaced 14-line stub with full Express 5 gateway: env guard, dynamic CORS, Morgan logging, 6 route modules
- All 10 frontend-called routes implemented — health, products (per_page=100), create/update order, customer CRUD (PII-stripped), create-payment-intent, and 3 Phase 2 JWT stubs at 501
- Dev workflow wired: `npm run dev` starts Vite + Express via concurrently, server auto-restarts via nodemon on file changes

## Task Commits

Each task was committed atomically:

1. **Task 1: Server entry point, woocommerce client, error handler, env example** - `d57a5e0` (feat)
2. **Task 2: All route files and dev workflow scripts** - `c42ca0c` (feat)

**Plan metadata:** (pending — final commit hash below)

## Files Created/Modified

- `server/index.cjs` - Express entry point: env guard, CORS allowlist, Morgan, route mounting, error handler
- `server/woocommerce.cjs` - WooCommerceRestApi singleton initialized from env vars
- `server/middleware/errorHandler.cjs` - Normalized {error, code, message} error shape
- `server/routes/health.cjs` - GET /api/health returning {status:ok, timestamp}
- `server/routes/products.cjs` - GET /api/products with per_page:100 and full product shaping
- `server/routes/orders.cjs` - POST /api/create-order (201), POST /api/update-order
- `server/routes/customers.cjs` - POST /api/login (501), GET/PUT /api/customer/:id with PII stripping
- `server/routes/payments.cjs` - POST /api/create-payment-intent via Stripe
- `server/routes/auth.cjs` - Phase 2 JWT stubs: /auth/login, /auth/refresh, /auth/logout (all 501)
- `server/.env.example` - Template with all required env var names and placeholder values
- `package.json` - Updated scripts: dev (concurrently), dev:client (vite), dev:server (nodemon)
- `.gitignore` - Added server/.env

## Decisions Made

- Dynamic CORS callback used (not open wildcard) because `credentials:true` + wildcard is invalid per browser spec — origin must be explicitly matched
- Express 5 async route handlers used without try/catch — Express 5 auto-forwards rejected promises to the error handler, making catch blocks redundant
- `per_page: 100` hardcoded in products route per DATA-01 requirement and plan specification
- PII stripping on GET /customer/:id returns only `{id, email, first_name, last_name}` per AUTH-06, established in Phase 1 as a safe pattern before Phase 2 auth
- Auth routes return 501 Not Implemented (not 404) to communicate "planned but not yet built" to callers

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Installed missing morgan, concurrently, nodemon, @types/morgan packages**
- **Found during:** Task 1 setup
- **Issue:** morgan was missing from node_modules; concurrently and nodemon were missing (required for Task 2 scripts)
- **Fix:** Ran `npm install --save morgan && npm install --save-dev concurrently nodemon @types/morgan`
- **Files modified:** package.json, package-lock.json
- **Verification:** All packages load successfully; server starts with Morgan logging
- **Committed in:** d57a5e0 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (missing dependencies — Rule 2)
**Impact on plan:** Packages were listed as requirements in the plan action; their absence was a blocking install step, not a scope change.

## Issues Encountered

None — plan executed cleanly. All verification checks passed.

## User Setup Required

**External services require manual configuration before `npm run dev` will work end-to-end.**

Copy `server/.env.example` to `server/.env` and fill in real values:

```bash
cp server/.env.example server/.env
```

Required values:
- `WC_URL` — WooCommerce store URL (e.g., https://heyskipper.com)
- `WC_CONSUMER_KEY` and `WC_CONSUMER_SECRET` — from WooCommerce > Settings > Advanced > REST API
- `STRIPE_SECRET_KEY` — from Stripe dashboard > Developers > API keys (use `sk_test_` for development)
- `FRONTEND_URL` — set to `http://localhost:5173` for local dev

## Next Phase Readiness

- Express proxy is fully functional; any frontend fetch to `http://localhost:3000/api/*` will route correctly
- Phase 2 auth routes are stubbed at 501 — Phase 2 can replace stubs with real JWT implementations without changing routing
- `credentials:true` and dynamic CORS are already in place — Phase 2 httpOnly cookie flow will work without server changes
- Remaining open concern: TitanHostingHub Node.js support not yet confirmed (see STATE.md blockers)

---
*Phase: 01-infrastructure*
*Completed: 2026-03-05*

## Self-Check: PASSED

All 11 files found on disk. Both task commits (d57a5e0, c42ca0c) confirmed in git log.
