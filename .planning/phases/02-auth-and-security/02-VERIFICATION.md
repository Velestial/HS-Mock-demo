---
phase: 02-auth-and-security
verified: 2026-03-06T00:00:00Z
status: gaps_found
score: 9/11 must-haves verified
re_verification: false
gaps:
  - truth: "Account page shows loading spinner/state while session is being restored on mount"
    status: failed
    reason: "AccountPage.sessionLoading spinner is unreachable via normal navigation. AuthWrapper renders LoginPage (not AccountPage) whenever user is null — including during the ~200ms session restore window when sessionLoading is true. The spinner in AccountPage only fires if AccountPage is rendered with user === null, which AuthWrapper prevents."
    artifacts:
      - path: "components/AuthWrapper.tsx"
        issue: "Checks only `user`, not `sessionLoading`. When sessionLoading is true and user is null, AuthWrapper renders LoginPage instead of the spinner. The spinner in AccountPage is dead code in this navigation path."
      - path: "components/AccountPage.tsx"
        issue: "sessionLoading guard exists and is substantive, but is unreachable — AuthWrapper short-circuits to LoginPage before AccountPage can render."
    missing:
      - "AuthWrapper must check sessionLoading from useAuth() and render a loading spinner (or null) while true, before deciding between LoginPage and AccountPage"
  - truth: "After logout, user lands on the Home page"
    status: partial
    reason: "AccountPage.handleLogout calls logout() then onBack(). AuthWrapper passes onBack from App.tsx (which sets view to 'home'). The wiring is correct when reaching AccountPage via AuthWrapper. However, because the sessionLoading spinner is unreachable in AuthWrapper, a user who refreshes while authenticated may briefly see the LoginPage (no onBack call triggers on that transient render). The logout path itself is correctly wired when the user is fully authenticated."
    artifacts:
      - path: "components/AuthWrapper.tsx"
        issue: "Transient LoginPage flash during session restore could confuse users, but logout navigation itself is correctly wired through onBack()"
    missing:
      - "AuthWrapper sessionLoading guard (same fix as gap 1) eliminates the transient LoginPage render on refresh"
human_verification:
  - test: "Session restore UX — page refresh while authenticated"
    expected: "User should see a loading indicator (not the login form) for ~200ms during session restore, then be taken to the Account page"
    why_human: "AuthWrapper gap means the current code shows LoginPage briefly during restore. After fix, a human must confirm the spinner appears and the transition is smooth"
  - test: "Duplicate email on registration shows correct message"
    expected: "Entering an existing WC email shows exactly: 'An account with this email already exists. Log in instead?'"
    why_human: "Depends on WC backend errorCode 38 — cannot verify without live WC instance"
  - test: "New registration auto-login — no second login step"
    expected: "After successful registration form submit, user lands directly on Account page without being asked to log in again"
    why_human: "Requires live WC backend to create a real account"
  - test: "hs_refresh cookie flags in browser DevTools"
    expected: "After login, hs_refresh cookie has HttpOnly flag checked and Secure flag (in production)"
    why_human: "Browser DevTools inspection required"
---

# Phase 2: Auth and Security — Verification Report

**Phase Goal:** Secure JWT authentication with httpOnly cookie session management, in-memory access token, silent refresh, and WooCommerce user registration with Turnstile CAPTCHA.
**Verified:** 2026-03-06
**Status:** gaps_found
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #  | Truth | Status | Evidence |
|----|-------|--------|---------|
| 1  | POST /api/auth/login returns 200 with accessToken in body and hs_refresh httpOnly cookie | VERIFIED | auth.cjs lines 31-55: real WC proxy, setRefreshCookie(), res.json with accessToken |
| 2  | POST /api/auth/refresh with valid cookie returns new accessToken | VERIFIED | auth.cjs lines 57-85: reads req.cookies.hs_refresh, proxies to WC, returns new token |
| 3  | POST /api/auth/logout clears the hs_refresh cookie and returns 200 | VERIFIED | auth.cjs lines 87-94: clearCookie + res.json({success:true}) |
| 4  | POST /api/auth/register creates a WC user and returns accessToken + sets cookie | VERIFIED | auth.cjs lines 96-147: two-step (create then auto-login), setRefreshCookie, 201+token |
| 5  | Wrong credentials return 401 with generic message (no account existence leakage) | VERIFIED | auth.cjs line 46: INVALID_CREDENTIALS, raw WC error not forwarded |
| 6  | User can log in and is granted access to the Account page | VERIFIED | AuthContext.login() calls loginUser(), sets user state; AuthWrapper renders AccountPage when user is set |
| 7  | Page refresh does not log the user out — session restores silently | PARTIAL | AuthContext mount useEffect calls refreshSession() and restores token — mechanism is correct. But AuthWrapper shows LoginPage during restore (gap — see below) |
| 8  | Access token lives only in React memory (useRef) — not in localStorage or sessionStorage | VERIFIED | AuthContext.tsx line 39: accessTokenRef = useRef, line 141: getAccessToken returns ref; persistUser() writes only id/email/name |
| 9  | localStorage after login contains only id, email, first_name, last_name — no PII | VERIFIED | persistUser() line 44-49: explicitly writes only those four fields; no billing/shipping/phone anywhere in AuthContext or AccountPage |
| 10 | Registration form includes Cloudflare Turnstile CAPTCHA before submit | VERIFIED | LoginPage.tsx line 4: Turnstile import; lines 137-146: Turnstile widget conditional on isRegistering; line 150: submit disabled until turnstileReady |
| 11 | Account page shows loading spinner while session is being restored on mount | FAILED | AccountPage has the spinner (lines 34-43) but AuthWrapper.tsx only checks `user` — renders LoginPage when user is null regardless of sessionLoading. Spinner is unreachable. |

**Score: 9/11 truths verified (1 failed, 1 partial)**

---

## Required Artifacts

### Plan 02-01 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `server/routes/auth.cjs` | login, refresh, logout, register handlers | VERIFIED | 149 lines, all four handlers implemented, no 501 stubs, inline helpers |
| `server/index.cjs` | cookie-parser middleware mounted before routes | VERIFIED | Line 13: `require('cookie-parser')`, line 41: `app.use(cookieParser())` — before all route mounting at lines 44-49 |
| `server/routes/customers.cjs` | POST /login stub removed | VERIFIED | File has 4 routes (GET/:id, GET/:id/orders, GET/:id/downloads, PUT/:id) — no POST /login anywhere |

### Plan 02-02 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `context/AuthContext.tsx` | accessTokenRef, session restore, silent refresh, schema guard | VERIFIED | 149 lines; accessTokenRef (line 39), scheduleTokenRefresh (line 56), schema guard (lines 86-90), refreshSession on mount (line 93), persistUser writes 4 fields only |
| `services/api.ts` | loginUser, refreshSession, logoutUser, registerUser with withCredentials | VERIFIED | Lines 114-143: all four functions present, all include withCredentials: true |

### Plan 02-03 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `context/AuthContext.tsx` | register() calling registerUser() | VERIFIED | Lines 127-139: real implementation, calls registerUser(), sets accessToken+user, handles requiresLogin |
| `components/LoginPage.tsx` | Turnstile widget, firstName field, toggle, EMAIL_EXISTS error | VERIFIED | Lines 4, 20-24, 26-27, 39-41, 93-107, 137-146, 150, 166-171: all present |
| `components/AccountPage.tsx` | sessionLoading spinner, logout to Home | PARTIAL | Spinner exists (lines 34-43) but unreachable via AuthWrapper (see Gaps). Logout wiring is correct (handleLogout line 29-32 calls logout() then onBack()) |

---

## Key Link Verification

### Plan 02-01 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `server/routes/auth.cjs` | `WC_URL/wp-json/simple-jwt-login/v1/auth` | fetch POST with email+password | VERIFIED | Lines 37-41, 129-133: both login and register step 2 call this endpoint |
| `server/routes/auth.cjs` | `res.cookie('hs_refresh', ...)` | setRefreshCookie helper | VERIFIED | Lines 10-19: helper defined; called at lines 53, 83, 145 |

### Plan 02-02 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `context/AuthContext.tsx` | `/api/auth/refresh` | axios POST withCredentials on mount useEffect | VERIFIED | Line 93: refreshSession() called in mount effect; services/api.ts line 122: withCredentials: true |
| `context/AuthContext.tsx` | `accessTokenRef.current` | useRef (not useState) | VERIFIED | Line 39: useRef declaration; lines 108, 117, 134, 141: all token writes go to ref |
| `context/AuthContext.tsx` | `localStorage.getItem('heyskipper_schema_version')` | schema version guard on mount | VERIFIED | Lines 86-90: guard reads version, evicts USER_KEY if < 2, writes new version |

### Plan 02-03 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `components/LoginPage.tsx` | `AuthContext.register(firstName, email, password)` | handleSubmit when isRegistering is true | VERIFIED | Lines 42: `await register(formData.firstName, formData.email, formData.password)` |
| `context/AuthContext.tsx` | `registerUser()` from services/api.ts | register() implementation | VERIFIED | Line 2: import includes registerUser; line 128: called in register() |
| `components/AccountPage.tsx` | `AuthContext.logout()` | handleLogout calls logout() then onBack() | VERIFIED | Lines 29-32: `await logout(); onBack();` |
| `components/AuthWrapper.tsx` | sessionLoading state | show spinner during mount restore | FAILED | AuthWrapper only reads `user`, not `sessionLoading`. The spinner in AccountPage is never reached during session restore. |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|---------|
| AUTH-01 | 02-01, 02-02 | Login with email + password using WC JWT | SATISFIED | /api/auth/login proxies to Simple JWT Login; AuthContext.login() wires UI to endpoint |
| AUTH-02 | 02-01, 02-02 | Access token in-memory; refresh token in httpOnly cookie | SATISFIED | accessTokenRef (useRef); hs_refresh cookie with httpOnly:true |
| AUTH-03 | 02-01, 02-02 | Session persists across page refresh via silent refresh | PARTIAL | Mechanism is correct (refreshSession on mount, timer-based refresh). However the UX during restore (sessionLoading gap) means users may see a login flash — technically the session does restore, but the transition is jarring |
| AUTH-04 | 02-01, 02-03 | User can log out from any page, all tokens cleared | SATISFIED | logout() clears timer, nulls ref, clears localStorage, calls logoutUser() to clear server cookie |
| AUTH-05 | 02-01, 02-03 | New customers can register with email and password | SATISFIED | /api/auth/register creates WC user and auto-logs in; register() in AuthContext wires UI end-to-end |
| AUTH-06 | 02-02, 02-03 | localStorage has only identity fields — no billing/phone/PII | SATISFIED | persistUser() writes {id, email, first_name, last_name} only; schema guard evicts old data; no billing/shipping in AccountPage rendering |

---

## Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `components/AccountPage.tsx` line 235-249 | `DownloadsTab` renders a hardcoded mock download ("Surf Fishing Guide v2.0") with no real data | Warning | Cosmetic only — shows fake data; comment notes "Mocked for now as we don't have real digital products". Does not block auth goal. |
| `components/AuthWrapper.tsx` line 12-17 | Does not check `sessionLoading` before rendering LoginPage | Blocker | Causes sessionLoading spinner in AccountPage to be unreachable; users see LoginPage flash on refresh |
| `components/LoginPage.tsx` line 17 | `onLoginSuccess` prop receives `() => { }` (empty function) from AuthWrapper | Warning | After successful login, onLoginSuccess fires but does nothing — navigation to Account page relies on AuthWrapper re-rendering when `user` changes in context state (which works correctly), so this is not a functional bug |

---

## Human Verification Required

### 1. Session Restore UX After Fix

**Test:** With a valid session (logged-in user), perform a hard page refresh (Ctrl+Shift+R).
**Expected:** A brief loading indicator appears (not the login form), then the Account page loads automatically within ~200ms.
**Why human:** Requires live browser + server environment; timing is visual.

### 2. Duplicate Email on Registration

**Test:** In the registration form, enter an email already registered in WooCommerce. Complete Turnstile and submit.
**Expected:** Error message reads exactly "An account with this email already exists. Log in instead?" (no generic error).
**Why human:** Requires live WooCommerce backend with errorCode 38 response; cannot verify against mock.

### 3. New Account Registration — Auto-Login

**Test:** Register with a brand-new email. Complete Turnstile and submit.
**Expected:** User is immediately shown the Account page — no second login step required.
**Why human:** Requires live WC backend to create the account and issue a JWT.

### 4. httpOnly Cookie Verification

**Test:** Open DevTools > Application > Cookies after login.
**Expected:** `hs_refresh` cookie has the HttpOnly flag checked.
**Why human:** Cookie flags are not readable by JavaScript and cannot be verified statically.

---

## Gaps Summary

**One blocker gap prevents full goal achievement.**

The `sessionLoading` spinner planned for the session-restore UX exists in `AccountPage.tsx` but is unreachable because `AuthWrapper.tsx` does not check the `sessionLoading` flag. When a user with a valid session cookie loads the app, `user` starts as `null` and `AuthWrapper` immediately renders `LoginPage`. The `refreshSession()` call in `AuthContext`'s mount effect restores the session correctly (setting `user` and the access token), and `AuthWrapper` re-renders to show `AccountPage` — but the intended spinner never fires. Users see a flash of the login form before the Account page appears.

**Fix required:** `AuthWrapper` must read `sessionLoading` from `useAuth()` and render a loading indicator (or null) while `true`, before evaluating whether to show `LoginPage` or `AccountPage`.

All other phase goals are fully achieved: the four Express auth endpoints are real implementations (no stubs), cookie-parser is wired, the access token is in-memory only, localStorage holds only identity fields, the schema guard evicts old PII, Turnstile is on the registration form, EMAIL_EXISTS error is handled correctly, and logout navigates home.

---

_Verified: 2026-03-06_
_Verifier: Claude (gsd-verifier)_
