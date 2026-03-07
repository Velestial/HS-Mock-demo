---
phase: 02-auth-and-security
plan: 03
subsystem: auth
tags: [jwt, turnstile, cloudflare, react-context, registration, woocommerce, session-restore]

# Dependency graph
requires:
  - phase: 02-01
    provides: POST /api/auth/register — creates WC user, auto-logs in, returns 201+token
  - phase: 02-02
    provides: AuthContext with register() stub, registerUser() in services/api.ts, sessionLoading flag

provides:
  - register() fully implemented — calls registerUser(), sets accessToken + user, schedules refresh
  - LoginPage registration form with Cloudflare Turnstile, First Name field, EMAIL_EXISTS error handling
  - AccountPage sessionLoading spinner during mount-time session restore
  - Logout redirects to Home via onBack() prop pattern
  - "Forgot password?" link on login form pointing to heyskipper.com/my-account/lost-password

affects:
  - Any future plan touching LoginPage, AuthContext, or AccountPage

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Turnstile client-side UX guard (token validates human presence before submit; server-side verification deferred to Phase 3/PAY-03)
    - EMAIL_EXISTS error code forwarded verbatim from WC → Express → axios error → UI message
    - sessionLoading spinner pattern: check before `if (!user)` to prevent flash of login form during cookie refresh

key-files:
  created: []
  modified:
    - context/AuthContext.tsx
    - components/LoginPage.tsx
    - components/AccountPage.tsx
    - components/Navbar.tsx
    - server/routes/auth.cjs
    - types.ts
    - data/products.ts
    - index.html

key-decisions:
  - "Turnstile token is UX-only in Phase 2 — not sent to backend; server-side verification scoped to Phase 3 per PAY-03"
  - "EMAIL_EXISTS error code: server returns {code:'EMAIL_EXISTS', message:'An account with this email already exists. Log in instead?'} — client shows message verbatim (not a generic error)"
  - "Logout navigation uses onBack() prop pattern (App.tsx page state) not react-router — consistent with all other page navigation in this project"
  - "duplicate email detection fixed to use WC errorCode 38 (not string matching) for reliability"

patterns-established:
  - "Turnstile widget: show only when isRegistering is true; reset token+ready state on toggle; disable submit until onSuccess fires"
  - "Error boundary in register form: axios.isAxiosError() + err.response?.data?.code check before falling back to generic message"

requirements-completed: [AUTH-04, AUTH-05, AUTH-06]

# Metrics
duration: 15min
completed: 2026-03-07
---

# Phase 2 Plan 3: Registration Flow Summary

**End-to-end WC account registration with Cloudflare Turnstile, auto-login on success, sessionLoading spinner, and EMAIL_EXISTS error handling — all 6 UAT tests passed**

## Performance

- **Duration:** 15 min (code) + UAT session
- **Started:** 2026-03-07T03:27:59Z
- **Completed:** 2026-03-07T04:59:54Z
- **Tasks:** 3 (2 auto + 1 human-verify)
- **Files modified:** 8 (including UAT fixes)

## Accomplishments

- Replaced register() stub in AuthContext with real registerUser() call — new WC account created and user auto-logged in without a second login step
- Added Cloudflare Turnstile to LoginPage registration form using VITE_TURNSTILE_SITE_KEY env var — submit blocked until widget completes
- Added sessionLoading spinner to AccountPage — prevents flash of login form during ~200ms mount-time cookie refresh
- UAT revealed and fixed: Navbar displayName crash, duplicate email detection bug (errorCode 38), LoginPage error display, Product type subCategory field, data/products re-export, index.html entry point

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement register() in AuthContext and update LoginPage** - `f03a92e` (feat)
2. **Task 2: Add sessionLoading spinner to AccountPage** - `c026065` (feat)
3. **Task 3: Human verification (UAT)** - approved — UAT fixes committed separately

## Files Created/Modified

- `context/AuthContext.tsx` — register() stub replaced with real registerUser() call; sets accessToken, user, schedules token refresh; handles requiresLogin edge case
- `components/LoginPage.tsx` — Turnstile widget (VITE_TURNSTILE_SITE_KEY), formData.name renamed to formData.firstName, "First Name" label, submit disabled until Turnstile ready, EMAIL_EXISTS error shown verbatim, "Forgot password?" link on login form, toggle resets Turnstile state
- `components/AccountPage.tsx` — sessionLoading spinner added before `if (!user)` check; destructures sessionLoading from useAuth(); handleLogout already called onBack() which navigates to Home
- `components/Navbar.tsx` — (UAT fix) `user.name` replaced with `user.first_name || user.email.split('@')[0]` to match AuthUser type
- `server/routes/auth.cjs` — (UAT fix) duplicate email detection changed to check WC errorCode 38 instead of string matching
- `components/LoginPage.tsx` — (UAT fix) error display updated to use `err.response.data.message` for EMAIL_EXISTS
- `types.ts` — (UAT fix) `subCategory` and `itemsSold` fields added to Product interface
- `data/products.ts` — (UAT fix) Product type re-exported so Navbar.tsx import works
- `index.html` — (UAT fix) entry point corrected from `/src/main.tsx` to `/main.tsx`

## Decisions Made

- Turnstile token is UX-only in Phase 2 — not forwarded to the backend; server-side Turnstile verification scoped to Phase 3 per PAY-03 plan
- EMAIL_EXISTS error code forwarded verbatim: server returns structured `{code, message}`, client checks `err.response.data.code === 'EMAIL_EXISTS'` and shows `err.response.data.message` directly
- Logout uses `onBack()` prop (App.tsx page-state pattern) not react-router `navigate()` — consistent with all other navigation in the project
- Duplicate email detection fixed to use WC `errorCode: 38` check (reliable numeric code) rather than error message string matching (fragile, locale-dependent)

## Deviations from Plan

### UAT-Discovered Fixes (applied after human verification identified issues)

**1. [Rule 1 - Bug] Navbar.tsx crash on user.name (field does not exist on AuthUser)**
- **Found during:** UAT Test 1 (login flow)
- **Issue:** Navbar rendered `user.name` but AuthUser type has `first_name`/`last_name`, not `name` — caused runtime crash after login
- **Fix:** Changed to `user.first_name || user.email.split('@')[0]`
- **Files modified:** `components/Navbar.tsx`
- **Verification:** Login no longer crashes; display name renders correctly

**2. [Rule 1 - Bug] Duplicate email detection used fragile string matching instead of WC errorCode**
- **Found during:** UAT Test 5 (duplicate email)
- **Issue:** server/routes/auth.cjs matched on WC error message text; WC actually returns `errorCode: 38` for existing user — string match was unreliable
- **Fix:** Changed detection to `wcData.errorCode === 38`
- **Files modified:** `server/routes/auth.cjs`
- **Verification:** UAT Test 5 passed — correct "An account with this email already exists. Log in instead?" message shown

**3. [Rule 1 - Bug] LoginPage showed raw axios error object instead of server message**
- **Found during:** UAT Test 5 (duplicate email)
- **Issue:** catch block was not extracting `err.response.data.message` for EMAIL_EXISTS — showed "[object Object]"
- **Fix:** Added axios.isAxiosError() check + `err.response.data.code === 'EMAIL_EXISTS'` branch to display `err.response.data.message` verbatim
- **Files modified:** `components/LoginPage.tsx`
- **Verification:** EMAIL_EXISTS error message rendered correctly in UI

**4. [Rule 3 - Blocking] Product interface missing subCategory and itemsSold fields**
- **Found during:** UAT (TypeScript errors blocking build)
- **Issue:** `types.ts` Product interface didn't include `subCategory` or `itemsSold` — pre-existing deferred items from 02-02 blocked Vite build
- **Fix:** Added both fields to Product interface
- **Files modified:** `types.ts`
- **Verification:** TypeScript compiles clean

**5. [Rule 3 - Blocking] data/products.ts not re-exporting Product type**
- **Found during:** UAT (import error in Navbar.tsx)
- **Issue:** Navbar imported `{ Product }` from `data/products` but products.ts didn't re-export the type
- **Fix:** Added `export type { Product }` re-export to data/products.ts
- **Files modified:** `data/products.ts`
- **Verification:** Navbar import resolved

**6. [Rule 3 - Blocking] index.html entry point path incorrect**
- **Found during:** UAT (Vite dev server returning blank page)
- **Issue:** index.html referenced `/src/main.tsx` but actual entry point is `/main.tsx`
- **Fix:** Updated script src to `/main.tsx`
- **Files modified:** `index.html`
- **Verification:** Vite dev server loaded app correctly

---

**Total deviations:** 6 UAT-discovered fixes (3 bugs, 3 blocking issues)
**Impact on plan:** All fixes necessary for correctness and functionality. Bugs 1-3 directly affected auth flow. Fixes 4-6 unblocked the Vite build and were pre-existing issues surfaced during live testing.

## Issues Encountered

None during pre-UAT execution. UAT revealed 6 issues documented above — all resolved before final approval.

## User Setup Required

None — no new external service configuration required. VITE_TURNSTILE_SITE_KEY must be set in `.env` (established in prior plans; no new env vars added in this plan).

## Next Phase Readiness

- Phase 2 auth is complete: login, refresh, logout, register all working end-to-end with real WC backend
- All 6 UAT tests passed — auth flow is production-ready for the Phase 2 scope
- Phase 3 (Payments) can proceed: auth is stable, getAccessToken() available for authenticated API calls
- Deferred to Phase 3: Turnstile server-side verification (PAY-03)

---
*Phase: 02-auth-and-security*
*Completed: 2026-03-07*
