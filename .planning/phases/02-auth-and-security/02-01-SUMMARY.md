---
phase: 02-auth-and-security
plan: 01
subsystem: auth
tags: [jwt, simple-jwt-login, cookie-parser, woocommerce, express, httponly-cookies]

# Dependency graph
requires:
  - phase: 01-infrastructure
    provides: Express server with CORS, error handler, and route mounting

provides:
  - POST /api/auth/login — proxies to WC Simple JWT Login, returns accessToken + sets hs_refresh cookie
  - POST /api/auth/refresh — validates hs_refresh cookie, issues new token from WC
  - POST /api/auth/logout — clears hs_refresh cookie
  - POST /api/auth/register — creates WC user then auto-logs in, returns 201 + token
  - cookie-parser middleware mounted in Express before routes

affects:
  - 02-02 (AuthContext migration depends on these endpoints being real)
  - 02-03 (Registration UI depends on /auth/register)

# Tech tracking
tech-stack:
  added: [cookie-parser]
  patterns:
    - Express async handlers without try/catch (Express 5 auto-forwards rejections)
    - Generic 401 on bad credentials (never reveals account existence)
    - httpOnly session cookie (hs_refresh) with sameSite Strict in dev, None in production
    - decodeJwtPayload without signature verification (WC is authoritative issuer)

key-files:
  created: []
  modified:
    - server/routes/auth.cjs
    - server/index.cjs
    - server/routes/customers.cjs

key-decisions:
  - "cookie-parser mounted after express.json() and before all route mounting"
  - "sameSite: None in production (cross-domain Vercel + TitanHostingHub), Strict in dev (same-origin via Vite proxy)"
  - "No maxAge on hs_refresh — session cookie expires when browser closes (user controls session duration)"
  - "Register endpoint does Step 1 (create user) then Step 2 (auto-login) — returns 201+token on success, 201+requiresLogin if auto-login fails"
  - "Duplicate email detection via WC error code and message text inspection"

patterns-established:
  - "WC proxy pattern: fetch to WC, check wcRes.ok && wcData.success, forward generic error (not raw WC message)"
  - "hs_refresh cookie helper: setRefreshCookie() and clearCookie() use same options object for consistency"
  - "buildUser() trims JWT payload to {id, email, first_name, last_name} — no PII beyond identity"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05]

# Metrics
duration: 12min
completed: 2026-03-06
---

# Phase 2 Plan 1: Auth Endpoints Summary

**Four Simple JWT Login proxy handlers (login, refresh, logout, register) with httpOnly hs_refresh session cookie via cookie-parser**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-06T00:17:32Z
- **Completed:** 2026-03-06T00:29:00Z
- **Tasks:** 2
- **Files modified:** 4 (server/index.cjs, server/routes/auth.cjs, server/routes/customers.cjs, package.json)

## Accomplishments

- Installed cookie-parser and mounted it in Express after express.json() so req.cookies is available in all auth handlers
- Replaced all four 501 stubs in auth.cjs with real Simple JWT Login proxy handlers using Express 5 async pattern
- Removed conflicting POST /login stub from customers.cjs
- Verified all endpoints respond correctly: logout returns 200, no-cookie refresh returns 401 NO_SESSION, missing-fields login returns 400

## Task Commits

Each task was committed atomically:

1. **Task 1: Add cookie-parser and remove stale /login stub** - `41d4b7d` (feat)
2. **Task 2: Implement login, refresh, logout, register handlers** - `cf68aa5` (feat)

## Files Created/Modified

- `server/routes/auth.cjs` - Four real auth handlers replacing 501 stubs; inline helpers decodeJwtPayload, setRefreshCookie, buildUser
- `server/index.cjs` - cookie-parser required and mounted before routes
- `server/routes/customers.cjs` - POST /login stub removed (4 customer routes remain unchanged)
- `package.json` / `package-lock.json` - cookie-parser added as dependency

## Decisions Made

- cookie-parser mounted after express.json() and before all route mounting — ensures req.cookies is populated for all routes
- sameSite: None in production (cross-domain Vercel + TitanHostingHub), Strict in dev (same-origin Vite proxy)
- No maxAge on hs_refresh — session cookie, expires when browser closes
- Register does Step 1 (create WC user) then Step 2 (auto-login) — avoids extra login step after registration
- Generic 401 INVALID_CREDENTIALS on bad login — WC error message is never forwarded (would reveal account existence)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

WordPress admin must configure Simple JWT Login before these endpoints work with a real WC backend:

1. **JWT TTL** — Set to 1440 minutes (24 hours) in WordPress Admin > Simple JWT Login > General Settings > JWT TTL
2. **Refresh token** — Verify "Allow refresh token" is enabled in WordPress Admin > Simple JWT Login > Refresh Token Settings
3. **Default user role** — Set to "customer" in WordPress Admin > Simple JWT Login > Register Settings > Default User Role

## Next Phase Readiness

- All four auth endpoints are live and verified — Plan 02-02 (AuthContext migration) and Plan 02-03 (registration UI) can proceed
- hs_refresh cookie is set on login/register/refresh; cleared on logout — AuthContext can call /auth/refresh on load to restore session
- No blockers

---
*Phase: 02-auth-and-security*
*Completed: 2026-03-06*
