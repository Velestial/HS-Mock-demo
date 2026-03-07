---
phase: 02-auth-and-security
plan: 02
subsystem: auth
tags: [jwt, react-context, useref, in-memory-token, session-restore, silent-refresh, schema-guard, localstorage-pii]

# Dependency graph
requires:
  - phase: 02-01
    provides: POST /api/auth/login, /auth/refresh, /auth/logout, /auth/register with httpOnly hs_refresh cookie

provides:
  - AuthUser type (id, email, first_name, last_name — no PII beyond identity)
  - In-memory access token via accessTokenRef (useRef — never touches localStorage or sessionStorage)
  - Session restore on mount via refreshSession() with withCredentials
  - Timer-based silent refresh 60s before JWT expiry
  - Schema version guard (v2) evicts old PII-polluted localStorage on first load
  - loginUser(email, password), refreshSession(), logoutUser(), registerUser() typed functions in services/api.ts

affects:
  - 02-03 (register() stub is ready — Plan 02-03 replaces it with real registerUser() call)
  - Any component calling useAuth() now gets sessionLoading flag for mount-time UX

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useRef for access token (avoids re-render on token update, prevents localStorage exposure)
    - useCallback for scheduleTokenRefresh (stable ref for useEffect dependency array)
    - Schema version guard pattern (integer version in localStorage evicts stale data on bump)
    - Best-effort logout (client clears state immediately; server cookie clear is fire-and-forget)
    - Timer-based silent refresh (setTimeout set 60s before JWT exp — cleared on logout)

key-files:
  created: []
  modified:
    - services/api.ts
    - context/AuthContext.tsx
    - components/AccountPage.tsx

key-decisions:
  - "Access token stored in useRef (not useState) — avoids re-render on every token refresh, never lands in localStorage"
  - "persistUser() writes only {id, email, first_name, last_name} to localStorage — no billing/shipping/phone per AUTH-06"
  - "Schema version guard runs before refreshSession() on mount — ensures old PII data is evicted before any state is set"
  - "logout() clears state synchronously before calling logoutUser() — user sees logged-out state immediately regardless of network"
  - "AccountPage.tsx updated to remove updateUser and billing/shipping display — profile editing deferred to future plan"
  - "Pre-existing TypeScript errors in data/products.ts and ShopPage.tsx logged to deferred-items.md — out of scope for this plan"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-06]

# Metrics
duration: 15min
completed: 2026-03-07
---

# Phase 2 Plan 2: AuthContext Migration Summary

**JWT auth layer with in-memory access token (useRef), httpOnly cookie session restore, timer-based silent refresh, and localStorage schema version guard that evicts pre-Phase-2 PII**

## Performance

- **Duration:** 15 min
- **Started:** 2026-03-07T03:22:10Z
- **Completed:** 2026-03-07T03:37:00Z
- **Tasks:** 2
- **Files modified:** 3 (services/api.ts, context/AuthContext.tsx, components/AccountPage.tsx)

## Accomplishments

- Added AuthUser, LoginResponse, RefreshResponse typed interfaces to services/api.ts
- Added four typed auth functions (loginUser, refreshSession, logoutUser, registerUser) all with withCredentials: true
- Renamed legacy single-arg loginUser to loginUserLegacy with @deprecated JSDoc
- Completely rewrote AuthContext.tsx: access token moved to useRef, PII fields removed, session restores on mount, timer-based silent refresh, schema version guard
- Updated AccountPage.tsx to remove updateUser (no longer in AuthContextType) and billing/shipping display (no longer in AuthUser)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add typed auth functions to services/api.ts** - `955a50e` (feat)
2. **Task 2: Rewrite AuthContext.tsx with in-memory token, session restore, schema guard** - `55c4806` (feat)

## Files Created/Modified

- `services/api.ts` — AuthUser/LoginResponse/RefreshResponse interfaces added; loginUser(email,password), refreshSession(), logoutUser(), registerUser() added; old loginUser renamed to loginUserLegacy with @deprecated
- `context/AuthContext.tsx` — Full rewrite: AuthUser type, accessTokenRef (useRef), sessionLoading state, mount-time refreshSession() call, scheduleTokenRefresh() timer, schema version guard (v2), persistUser()/clearPersistedUser() helpers, login/logout/register/getAccessToken functions
- `components/AccountPage.tsx` — Removed updateUser usage (no longer in context), removed billing/shipping display (fields removed from AuthUser), handleLogout updated to await async logout(), displayName uses first_name or email prefix (no username field)

## Decisions Made

- Access token stored in useRef (not useState) — avoids re-render on every token refresh, never lands in localStorage
- persistUser() writes only {id, email, first_name, last_name} to localStorage — no billing/shipping/phone per AUTH-06
- Schema version guard runs before refreshSession() on mount — ensures old PII data is evicted before any state is set
- logout() clears state synchronously before calling logoutUser() — user sees logged-out state immediately regardless of network
- AccountPage.tsx updated to remove updateUser and billing/shipping display — profile editing deferred to future plan

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated AccountPage.tsx to remove updateUser and incompatible User type references**
- **Found during:** Task 2
- **Issue:** AccountPage.tsx used `updateUser` from `useAuth()` (removed from AuthContextType) and referenced `user.username`, `user.billing`, `user.shipping`, `user.orders` fields that no longer exist on AuthUser
- **Fix:** Removed `updateUser` destructure and DetailsTab form submission. DetailsTab now displays identity fields read-only. OrdersTab and AddressesTab show placeholder messages (orders/address data comes from future API calls, not the auth user object). handleLogout updated to await async `logout()`. `displayName` uses `first_name || email.split('@')[0]` (no username field in AuthUser).
- **Files modified:** `components/AccountPage.tsx`
- **Commit:** `55c4806` (included in Task 2 commit)

### Out-of-Scope Items Logged

Pre-existing TypeScript errors in `data/products.ts`, `components/Navbar.tsx`, and `components/ShopPage.tsx` (missing `subCategory` on Product type, missing `Product` export from data/products) were discovered during tsc run. These errors pre-date this plan and are unrelated to auth. Logged to `.planning/phases/02-auth-and-security/deferred-items.md`.

## Issues Encountered

None.

## Success Criteria Verification

- [x] AuthContext.tsx: access token in useRef (not localStorage)
- [x] AuthContext.tsx: user identity in useState (AuthUser type)
- [x] AuthContext.tsx: session restore on mount via refreshSession() with withCredentials
- [x] AuthContext.tsx: timer-based silent refresh schedules 60s before token expiry
- [x] AuthContext.tsx: schema version guard clears old PII on first load
- [x] AuthContext.tsx: logout clears timer, nulls accessTokenRef, clears user, calls logoutUser()
- [x] services/api.ts: loginUser(email, password), refreshSession(), logoutUser(), registerUser() all typed and withCredentials
- [x] localStorage after login: only {id, email, first_name, last_name} — no billing/shipping/phone
- [x] TypeScript compiles clean for auth files (npx tsc --noEmit shows 0 errors in auth-related files)

## Next Phase Readiness

- Plan 02-03 (Registration UI) can proceed: register() stub is in AuthContext, registerUser() is in services/api.ts
- Any component needing the Bearer token calls `getAccessToken()` from useAuth()
- sessionLoading flag is available for login-gate UX during mount-time session restore

---
*Phase: 02-auth-and-security*
*Completed: 2026-03-07*
