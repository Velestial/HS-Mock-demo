# Phase 2: Auth and Security - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the demo auth stub with real WooCommerce JWT login, registration, and PII-safe session storage. Users can log in, stay logged in across refreshes, log out, and register — all backed by the live WooCommerce customer database via Simple JWT Login plugin. Auth failure states, session expiry, and bot protection are all in scope. Password reset and advanced account management are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Session Persistence
- Session does NOT persist across browser close — session-only cookie for refresh token (not long-lived)
- Session lasts 24 hours before requiring re-authentication
- Silent refresh: when access token expires, use refresh token in background — user never sees it
- Access token stored in React state (memory only) — gone on page refresh, restored via refresh cookie check on mount

### Login / Logout UX
- Login form lives inline on the Account page (existing AuthWrapper component)
- After successful login → land on Account page
- After logout → redirect to Home page
- Login button shows spinner/disabled state while auth request is in flight — no full-page overlay

### Registration Flow
- Required fields: first name + email + password (no confirm password field — single password input)
- Account page has toggle UI — "Don't have an account? Register" link switches between Login and Register forms
- After registration → auto-login and navigate to Account page (no second login step)
- WooCommerce sends the default new account email automatically (no suppression)
- If email already exists → show error: "An account with this email already exists. Log in instead?"
- Cloudflare Turnstile CAPTCHA on the registration form (same site key setup as CheckoutPage) — bot protection

### Auth Failure Handling
- Wrong credentials → generic error: "Invalid email or password" (does not reveal whether email exists)
- Account page accessed while logged out → show login form (no redirect)
- Session expires mid-browsing → silent refresh via refresh token — transparent to user
- Failed login attempt limits → not enforced in frontend (WooCommerce/server handles lockout)
- Cart persists on logout/session expiry — items kept in localStorage, available when user logs back in
- Password reset → link to WooCommerce lost password page (heyskipper.com/my-account/lost-password), not built in React

### Claude's Discretion
- Exact JWT access token expiry duration (15-60 minutes typical — Claude picks appropriate value)
- Turnstile widget placement within the registration form
- Loading skeleton or spinner design for session restore on mount
- Exact error message copy beyond the decisions above

</decisions>

<specifics>
## Specific Ideas

- Cloudflare Turnstile is already implemented on CheckoutPage — use the same pattern for the registration form
- AuthWrapper component already exists at `components/AuthWrapper.tsx` — extend it rather than rebuild
- Simple JWT Login plugin endpoint: `/wp-json/simple-jwt-login/v1/auth` returns `{ data: { jwt } }` — already confirmed in Phase 1 research

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-auth-and-security*
*Context gathered: 2026-03-06*
