# Phase 2: Auth and Security - Research

**Researched:** 2026-03-06
**Domain:** WooCommerce JWT authentication, httpOnly cookie session management, React in-memory token storage
**Confidence:** MEDIUM-HIGH (Simple JWT Login API verified via official docs; Express cookie patterns verified via multiple sources; some auth flow edge cases LOW confidence)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Session Persistence**
- Session does NOT persist across browser close — session-only cookie for refresh token (not long-lived)
- Session lasts 24 hours before requiring re-authentication
- Silent refresh: when access token expires, use refresh token in background — user never sees it
- Access token stored in React state (memory only) — gone on page refresh, restored via refresh cookie check on mount

**Login / Logout UX**
- Login form lives inline on the Account page (existing AuthWrapper component)
- After successful login → land on Account page
- After logout → redirect to Home page
- Login button shows spinner/disabled state while auth request is in flight — no full-page overlay

**Registration Flow**
- Required fields: first name + email + password (no confirm password field — single password input)
- Account page has toggle UI — "Don't have an account? Register" link switches between Login and Register forms
- After registration → auto-login and navigate to Account page (no second login step)
- WooCommerce sends the default new account email automatically (no suppression)
- If email already exists → show error: "An account with this email already exists. Log in instead?"
- Cloudflare Turnstile CAPTCHA on the registration form (same site key setup as CheckoutPage) — bot protection

**Auth Failure Handling**
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

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AUTH-01 | User can log in with email and password using WooCommerce JWT authentication | Simple JWT Login POST /auth endpoint verified; Express proxy pattern for login documented |
| AUTH-02 | JWT access token is stored in-memory (not localStorage); refresh token stored in httpOnly cookie | In-memory React state pattern + Express cookie-parser cookie-setting pattern documented |
| AUTH-03 | User session persists across page refresh via silent token refresh on mount (<200ms) | Token refresh endpoint `/auth/refresh` verified; on-mount check pattern documented |
| AUTH-04 | User can log out from any page, clearing all tokens and session data | Cookie clearance + in-memory state reset pattern documented |
| AUTH-05 | New customers can register an account with email and password | Simple JWT Login POST /users endpoint verified; auto-login after register pattern documented |
| AUTH-06 | Stored user data in localStorage contains only identity fields (id, email, name) — no billing address, phone, or PII | PII stripping already done on GET /customer/:id in customers.cjs; AuthContext User type must be trimmed |
</phase_requirements>

---

## Summary

Phase 2 replaces the demo auth stub (email-only login that ignores password, full WC PII dumped into localStorage) with a production-quality JWT session system. The architecture has three layers: Simple JWT Login plugin on WooCommerce (token issuer), Express proxy server (cookie manager and secret holder), and the React client (in-memory token holder). The user never directly touches the WC API — all auth calls flow through `/api/auth/*` on the Express proxy.

The token lifecycle is: login → Express calls Simple JWT Login → gets JWT → Express splits it into (a) short-lived access token returned as JSON body and (b) refresh token stored in httpOnly session cookie. React keeps only the access token in component state (`useState` or `useRef`). On page refresh, access token is gone; React calls `/api/auth/refresh` on mount, Express reads the httpOnly cookie, calls Simple JWT Login's refresh endpoint, and hands back a fresh access token — the user never notices. On logout, the cookie is cleared server-side and React state is nulled.

The existing codebase already has the correct scaffolding: CORS with `credentials: true`, 501 stub routes in `server/routes/auth.cjs`, a `AuthWrapper` component that conditionally renders login vs account, and Turnstile already wired in `CheckoutPage.tsx` using `@marsidev/react-turnstile`. This phase is surgical replacement, not greenfield.

**Primary recommendation:** Implement the three Express endpoints first (login, refresh, logout), then migrate AuthContext to use them with in-memory access token + httpOnly refresh cookie. Verify the full session lifecycle (login → refresh → logout) before touching the registration flow, since registration depends on auto-login working correctly.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `cookie-parser` | ^1.4.7 | Parse httpOnly cookies from incoming requests in Express | Standard Express middleware; without it `req.cookies` is undefined |
| Simple JWT Login plugin | (WP plugin, already installed) | WooCommerce JWT issuer — login, refresh, register endpoints | Already confirmed installed on this WC instance |
| `@marsidev/react-turnstile` | ^1.4.2 (already installed) | Cloudflare Turnstile CAPTCHA widget for registration form | Already in package.json, used on CheckoutPage |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `axios` (already installed) | ^1.13.5 | HTTP calls from React to Express proxy auth endpoints | Already used in services/api.ts |
| `jsonwebtoken` (optional) | ^9.x | Decode JWT payload to extract user identity fields (id, email, name) on the Express side | Needed if Express must validate or decode the JWT before forwarding — safe to use `jwt.decode()` (no verify needed since WC is authoritative) |

### No New React Libraries Needed
The existing React stack (useState, useEffect, useContext) is sufficient for token storage and session management. Do NOT add react-query, zustand, or dedicated auth libraries — they are out of scope for this phase.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| In-memory React state | localStorage for access token | localStorage is XSS-vulnerable; spec says in-memory only |
| Session-only cookie | Persistent cookie with long maxAge | User decision: session-only; persistent would survive browser close |
| Manual timer-based refresh | Axios interceptor catching 401s | Timer is more predictable; 401 interceptor risks race conditions with concurrent requests. Recommendation: use a timer set on login/refresh for access token expiry |

### Installation (new packages only)
```bash
# Server side only — cookie-parser is not a frontend dep
cd server && npm install cookie-parser
# If JWT decoding is needed on server:
npm install jsonwebtoken
```

Note: `@types/cookie-parser` and `@types/jsonwebtoken` for TypeScript if needed (server is .cjs so types are optional but helpful).

---

## Architecture Patterns

### File Structure After Phase 2

```
server/
├── routes/
│   └── auth.cjs           # Replace 501 stubs with real login/refresh/logout
├── middleware/
│   └── errorHandler.cjs   # Unchanged
├── index.cjs              # Add cookie-parser middleware
└── woocommerce.cjs        # Unchanged

context/
└── AuthContext.tsx         # Full rewrite: in-memory token, User type trimmed, session restore on mount

services/
└── api.ts                  # Add: loginUser(email, password), refreshSession(), logoutUser(), registerUser()

components/
└── AuthWrapper.tsx         # Extend: add Register form with toggle + Turnstile
```

### Pattern 1: Express Auth Route — Login

**What:** Express receives login credentials, proxies to Simple JWT Login, sets refresh token as httpOnly cookie, returns access token + minimal user identity as JSON body.

**When to use:** `POST /api/auth/login`

```javascript
// server/routes/auth.cjs — login handler
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Call Simple JWT Login on WooCommerce
  const wcRes = await fetch(`${process.env.WC_URL}/wp-json/simple-jwt-login/v1/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const wcData = await wcRes.json();

  if (!wcRes.ok || !wcData.success) {
    // Return generic error — do not forward WC error message (may reveal account existence)
    return res.status(401).json({ error: true, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
  }

  const accessToken = wcData.data.jwt;

  // Decode JWT payload to extract identity fields (no signature verification needed)
  // WC is authoritative — if it returned it, it's valid
  const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64url').toString());
  // Simple JWT Login JWT contains: id, email, username, exp, iat
  const user = { id: payload.id, email: payload.email, first_name: payload.user?.first_name || '' };

  // Set refresh token as httpOnly session cookie (no maxAge = session-only, expires on browser close)
  // The refresh token IS the same JWT — Simple JWT Login uses one token for both access and refresh
  // We differentiate by: short-lived copy in JSON body (access), longer copy in cookie (refresh)
  // Note: See Open Questions section — Simple JWT Login issues one token; clarify refresh mechanics
  res.cookie('hs_refresh', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    // No maxAge — session cookie expires when browser closes
  });

  res.json({ success: true, accessToken, user });
});
```

**Source:** Simple JWT Login official docs (simplejwtlogin.com/docs/authentication), verified 2026-03-06

### Pattern 2: Express Auth Route — Refresh

**What:** On app mount or access token expiry, React calls this endpoint. Express reads the httpOnly cookie, calls Simple JWT Login's refresh endpoint, returns a new access token.

**When to use:** `POST /api/auth/refresh`

```javascript
router.post('/auth/refresh', async (req, res) => {
  const existingToken = req.cookies?.hs_refresh;

  if (!existingToken) {
    return res.status(401).json({ error: true, code: 'NO_SESSION', message: 'No session' });
  }

  const wcRes = await fetch(`${process.env.WC_URL}/wp-json/simple-jwt-login/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ JWT: existingToken }),
  });

  const wcData = await wcRes.json();

  if (!wcRes.ok || !wcData.success) {
    // Refresh token expired or invalid — clear cookie, force re-login
    res.clearCookie('hs_refresh');
    return res.status(401).json({ error: true, code: 'SESSION_EXPIRED', message: 'Session expired' });
  }

  const newAccessToken = wcData.data.jwt;
  const payload = JSON.parse(Buffer.from(newAccessToken.split('.')[1], 'base64url').toString());
  const user = { id: payload.id, email: payload.email, first_name: payload.user?.first_name || '' };

  // Refresh the cookie with the new token (still session-only)
  res.cookie('hs_refresh', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });

  res.json({ success: true, accessToken: newAccessToken, user });
});
```

**Source:** Simple JWT Login refresh-token docs (simplejwtlogin.com/docs/refresh-token), verified 2026-03-06

### Pattern 3: Express Auth Route — Logout

**What:** Clear the httpOnly cookie. React nulls its in-memory state.

```javascript
router.post('/auth/logout', (req, res) => {
  res.clearCookie('hs_refresh', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  res.json({ success: true });
});
```

### Pattern 4: React AuthContext — In-Memory Token + Session Restore on Mount

**What:** AuthContext holds the access token in a `useRef` (not state, avoids re-renders on every API call), user identity in `useState`, and calls `/api/auth/refresh` on mount to restore session.

```typescript
// context/AuthContext.tsx — skeleton
const accessTokenRef = useRef<string | null>(null);
const [user, setUser] = useState<AuthUser | null>(null);
const [sessionLoading, setSessionLoading] = useState(true); // show spinner while restoring

useEffect(() => {
  // On mount: try to restore session from httpOnly cookie
  api.post('/api/auth/refresh')
    .then(res => {
      accessTokenRef.current = res.data.accessToken;
      setUser(res.data.user);
      scheduleTokenRefresh(res.data.accessToken); // set timer for silent refresh
    })
    .catch(() => {
      // No cookie or expired — user starts logged out, that's fine
    })
    .finally(() => setSessionLoading(false));
}, []);
```

**Source:** React JWT in-memory pattern — multiple verified sources (bezkoder.com, medium.com/@alperkilickaya), 2024

### Pattern 5: Timer-Based Silent Token Refresh

**What:** On every new access token received (login or refresh), schedule a setTimeout to call `/api/auth/refresh` shortly before the token expires. Cancel on logout.

```typescript
const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const scheduleTokenRefresh = (token: string) => {
  if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

  // Decode exp from JWT payload
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiresAt = payload.exp * 1000; // ms
  const refreshAt = expiresAt - Date.now() - 60_000; // 60s before expiry

  if (refreshAt > 0) {
    refreshTimerRef.current = setTimeout(silentRefresh, refreshAt);
  }
};
```

**Source:** Pattern from blog.galmalachi.com/react-and-jwt-authentication-the-right-way, cross-referenced with bezkoder.com implementation, 2024

### Pattern 6: Registration Flow

**What:** POST to Simple JWT Login's register endpoint, then immediately call login to get a JWT.

```javascript
// server/routes/auth.cjs — register handler
router.post('/auth/register', async (req, res) => {
  const { firstName, email, password } = req.body;

  // Step 1: Create WC user via Simple JWT Login
  const regRes = await fetch(`${process.env.WC_URL}/wp-json/simple-jwt-login/v1/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, first_name: firstName }),
  });

  const regData = await regRes.json();

  if (!regRes.ok || !regData.success) {
    // Check for duplicate email — WC returns specific error code for this
    // Map to user-friendly message per CONTEXT.md decision
    const isDuplicate = regData.code === 'registration-error-email-exists'
      || (regData.message || '').toLowerCase().includes('already registered');
    if (isDuplicate) {
      return res.status(409).json({ error: true, code: 'EMAIL_EXISTS', message: 'An account with this email already exists. Log in instead?' });
    }
    return res.status(400).json({ error: true, code: 'REGISTRATION_FAILED', message: 'Registration failed. Please try again.' });
  }

  // Step 2: Auto-login — call Simple JWT Login auth endpoint
  // (Reuse same login logic — can be extracted to a shared helper)
  const authRes = await fetch(`${process.env.WC_URL}/wp-json/simple-jwt-login/v1/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const authData = await authRes.json();

  // ... same cookie + response logic as login handler
});
```

### Pattern 7: Trimmed User Type (AUTH-06 Compliance)

**What:** AuthContext's `User` interface must only contain PII-safe identity fields. The existing `User` type includes billing address, phone, shipping — all must be removed.

```typescript
// New AuthUser type — replaces the existing User interface in AuthContext.tsx
export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

// localStorage stores ONLY this shape — complies with AUTH-06
// Key: 'heyskipper_user'
// Note: The existing AuthContext stores orders and billing in localStorage — this must be purged
```

### Pattern 8: Schema Version Guard (localStorage Migration)

**What:** Existing users may have the old full-PII object in `heyskipper_user` localStorage. On mount, check for old schema and evict it.

```typescript
const SCHEMA_VERSION = 2; // Increment when storage shape changes
const SCHEMA_KEY = 'heyskipper_schema_version';

// In AuthContext mount logic
const storedVersion = parseInt(localStorage.getItem(SCHEMA_KEY) || '0');
if (storedVersion < SCHEMA_VERSION) {
  // Old PII-polluted data — clear it, force fresh session restore from cookie
  localStorage.removeItem('heyskipper_user');
  localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
}
```

**Why:** Without this guard, users with the old schema will have stale full-PII data in localStorage even after the code update, until they manually log out.

### Anti-Patterns to Avoid

- **Access token in localStorage:** XSS-vulnerable. Spec says in-memory only. The existing AuthContext does this — it must be replaced.
- **Full WC customer object in localStorage:** Existing code stores billing/shipping/phone. AUTH-06 explicitly prohibits this. Must strip on migration.
- **Forwarding WC error messages to client:** Simple JWT Login returns detailed error strings that may reveal account existence ("No user found with this email"). Always map to generic messages.
- **Setting maxAge on the refresh cookie:** User decision is session-only (no persist across browser close). Do not set `maxAge` or `expires`.
- **Calling Simple JWT Login directly from the React frontend:** All WC API calls go through the Express proxy. The WC URL and credentials stay server-side.
- **register() calling login() as a stub:** Existing AuthContext does this. Must be replaced with actual WC customer creation.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cookie parsing in Express | Manual `req.headers.cookie` parsing | `cookie-parser` middleware | Handles encoding, multiple cookies, security edge cases |
| JWT payload decoding | Custom base64 parser | `Buffer.from(token.split('.')[1], 'base64url').toString()` (built-in) or `jwt.decode()` | One-liner, no library needed for decode-only (no verify) |
| Session storage system | Custom session tokens/IDs | httpOnly cookie holding the WC JWT directly | WC JWT is already signed — no need to re-sign or create separate session IDs |
| CAPTCHA system | Custom bot detection | Cloudflare Turnstile (already installed) | Already in package.json and wired on CheckoutPage |

**Key insight:** The WC JWT is the session token. The Express server does not need to maintain its own session store — it just proxies the WC JWT through a httpOnly cookie. This is stateless from the Express perspective.

---

## Common Pitfalls

### Pitfall 1: CORS + Credentials Cookie Not Sent

**What goes wrong:** The React frontend calls `/api/auth/refresh` on mount but the httpOnly cookie is not sent, so refresh always fails and users are always logged out on page refresh.

**Why it happens:** `axios.post('/api/auth/refresh')` without `withCredentials: true` — browser will not attach cookies to cross-origin requests.

**How to avoid:** Set `withCredentials: true` on every axios call that needs cookies (or configure an axios instance with it as default). The server already has `credentials: true` in CORS config from Phase 1.

**Warning signs:** Refresh endpoint responds 401 with `NO_SESSION` even though the user just logged in.

### Pitfall 2: Simple JWT Login Returns One Token (Not Access + Refresh Pair)

**What goes wrong:** Unlike OAuth2 flows that return separate `access_token` and `refresh_token`, Simple JWT Login returns a single JWT from `/auth`. The "refresh token" in our cookie is the same JWT — calling `/auth/refresh` with it gives a new JWT with a new expiry.

**Why it happens:** Simple JWT Login is simpler than OAuth2. It does not issue separate token types.

**How to avoid:** This is fine for the architecture — store the JWT in both "roles": as the access token in React memory (short-lived usage) and in the httpOnly cookie (for refreshing). The `/auth/refresh` endpoint extends the session by issuing a new token.

**Open question (see below):** Need to confirm the refresh window config. By default the plugin allows refresh for 2 weeks from original issuance. The 24-hour session limit is enforced by the initial JWT's `exp` claim duration set in plugin settings, not by the refresh endpoint itself.

### Pitfall 3: Duplicate /login Route Conflict

**What goes wrong:** `server/routes/customers.cjs` has a `POST /login` stub at line 6 (`/api/login`). The new auth route in `server/routes/auth.cjs` adds `POST /auth/login`. These are different paths but the old `/login` stub in customers.cjs must be removed to avoid confusion.

**Why it happens:** Phase 1 left a 501 stub in the wrong route file.

**How to avoid:** Remove the `POST /login` handler from `customers.cjs` when implementing auth. The canonical path is `/api/auth/login`.

### Pitfall 4: React Access Token Lost on Component Unmount

**What goes wrong:** Storing the access token in `useState` inside AuthProvider works, but if AuthProvider re-renders (e.g., due to parent state changes), the refresh timer `setTimeout` may be duplicated.

**Why it happens:** `useEffect` with timer creation runs on re-render if dependencies change.

**How to avoid:** Store the refresh timer in `useRef`, not state. Cancel it (`clearTimeout`) before setting a new one. Store the access token in `useRef` too if it doesn't need to trigger re-renders.

### Pitfall 5: Registration Error Message Leaks Account Existence

**What goes wrong:** Simple JWT Login returns a specific error when email already exists. Passing that raw message to the client violates the security decision of not revealing account existence.

**Why it happens:** Developer passes `wcData.message` directly to the response.

**How to avoid:** Inspect the WC error code/message server-side and map to exactly one of two user-facing messages: the "email already exists" variant (which is allowed per CONTEXT.md — "An account with this email already exists. Log in instead?") or a generic "Registration failed."

**Note:** The CONTEXT.md explicitly permits revealing email-exists on registration (but not on login). The login handler must still return generic errors only.

### Pitfall 6: `sameSite: 'Strict'` Breaks Cross-Site Scenarios

**What goes wrong:** If the React frontend and Express server are on different domains (e.g., `app.heyskipper.com` vs `api.heyskipper.com`), `sameSite: 'Strict'` will block the cookie.

**Why it happens:** Strict means cookie is only sent if the request originates from the exact same site.

**How to avoid:** If frontend and API are on different domains, use `sameSite: 'None'` + `secure: true`. If on the same domain (Vite proxying in dev, or same domain in prod), `'Strict'` or `'Lax'` is fine. Check the staging deployment topology from Phase 1 to confirm.

**Warning signs:** Login succeeds but refresh on mount always fails in staging even though it works in dev.

### Pitfall 7: Existing AuthContext localStorage Data Not Cleaned Up

**What goes wrong:** After deploying Phase 2, existing users who were logged in with the old demo auth still have the full WC customer object (with billing/phone/address) in `heyskipper_user` localStorage. AUTH-06 requires this be absent.

**Why it happens:** No migration guard.

**How to avoid:** Implement the schema version guard (Pattern 8 above). Check localStorage schema version on mount; if stale, evict old data before attempting refresh.

---

## Code Examples

### Simple JWT Login Endpoint Summary (verified)

```
POST /wp-json/simple-jwt-login/v1/auth
Body: { email, password }
Success: { success: true, data: { jwt: "..." } }
Error:   { success: false, error: "..." }

POST /wp-json/simple-jwt-login/v1/auth/refresh
Body: { JWT: "existing_jwt" }
Success: { success: true, data: { jwt: "new_jwt" } }
Error:   { success: false, error: "..." }

POST /wp-json/simple-jwt-login/v1/users
Body: { email, password, first_name, last_name }
Success: { success: true, id: 123, data: { ... } }
Error:   { success: false, data: { message: "..." } }
```

Source: simplejwtlogin.com/docs/authentication and /docs/refresh-token, verified 2026-03-06

### Express cookie-parser Setup

```javascript
// server/index.cjs — add after existing middleware
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// Must come BEFORE route mounting so req.cookies is populated
```

Source: npmjs.com/package/cookie-parser

### Axios withCredentials for Cookie Sending

```typescript
// services/api.ts — all auth calls need this
const response = await axios.post('/api/auth/login', { email, password }, {
  withCredentials: true, // sends httpOnly cookies
});

// Or configure an axios instance globally:
const authApi = axios.create({ withCredentials: true });
```

### Turnstile on Registration Form (existing pattern from CheckoutPage)

```tsx
// Already installed: @marsidev/react-turnstile ^1.4.2
import { Turnstile } from '@marsidev/react-turnstile';

const [turnstileToken, setTurnstileToken] = useState('');

<Turnstile
  siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
  onSuccess={setTurnstileToken}
  onError={() => setTurnstileToken('')}
  onExpire={() => setTurnstileToken('')}
/>
```

Note: CheckoutPage currently hardcodes the test key `1x00000000000000000000AA`. Registration should use the env var pattern so both forms use the same key from config.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Full WC customer object in localStorage | In-memory access token + httpOnly cookie | Phase 2 | Eliminates PII storage, eliminates XSS token theft |
| Email-only "magic link" demo login (password ignored) | Real WC JWT auth with email+password | Phase 2 | Actual authentication, not just user lookup |
| register() silently calling login() | register() calls POST /simple-jwt-login/v1/users then auto-login | Phase 2 | Actual WC account creation |
| 501 stub routes in auth.cjs | Real login/refresh/logout handlers | Phase 2 | Auth system goes live |

**Deprecated/outdated:**
- `loginUser(email)` in `services/api.ts`: Takes only email, no password, calls `/api/login` (wrong path). Replace with `loginUser(email, password)` calling `/api/auth/login`.
- `POST /login` stub in `customers.cjs`: Remove — superseded by `POST /auth/login` in `auth.cjs`.
- `User` type in `AuthContext.tsx` with billing/shipping fields: Replace with trimmed `AuthUser` type.

---

## Open Questions

1. **Simple JWT Login token expiry configuration**
   - What we know: The plugin issues one JWT. The 24-hour session requirement means the JWT's `exp` claim must be set to 24 hours in the plugin settings (WordPress Admin > Simple JWT Login > General Settings > JWT TTL).
   - What's unclear: Whether the currently installed plugin on heyskipper.com is configured with a 24-hour TTL, or still at the default. If it's at the default (longer), silent refresh would be infrequent and tokens would survive longer than 24h.
   - Recommendation: In Plan 02-01, include a note that the WP admin must set JWT TTL to 1440 minutes (24 hours) in Simple JWT Login settings. This is a human action, not a code action.

2. **Simple JWT Login refresh window vs. session expiry**
   - What we know: The refresh endpoint allows refreshing for "2 weeks from original token issuance" by default.
   - What's unclear: If the JWT TTL is 24 hours, does calling `/auth/refresh` with a 25-hour-old token succeed (because it's within the 2-week refresh window) or fail (because the token is expired)?
   - Recommendation: Plan for the case where the refresh endpoint may succeed even with an expired access token — the important constraint is the httpOnly cookie's SESSION scope (browser close = cookie gone). If the plugin's refresh window is longer than 24h, that's acceptable as long as the cookie is session-only.

3. **Registration: Does Simple JWT Login create a WooCommerce Customer (role: customer) or WordPress User (role: subscriber)?**
   - What we know: The `/v1/users` endpoint creates a WordPress user. The default role depends on plugin configuration.
   - What's unclear: Whether the role is set to `customer` (needed for WooCommerce order association) or `subscriber`.
   - Recommendation: After implementing registration, verify in WP Admin that a test registration creates a user with role `customer`. If not, the plugin's "Default User Role" setting must be changed to `customer`. Add this as a verification step in the plan.

4. **Cross-domain cookie scope in staging**
   - What we know: Phase 1 deployed Express to TitanHostingHub staging. The React frontend is presumably on a different origin in staging (e.g., Vercel).
   - What's unclear: Whether frontend and Express API share the same domain (same-site cookie allowed) or are cross-domain (requires `sameSite: 'None'` + `secure: true`).
   - Recommendation: Use `sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict'` and `secure: process.env.NODE_ENV === 'production'` to handle both environments. Confirm in staging after deployment.

---

## Sources

### Primary (HIGH confidence)
- `https://simplejwtlogin.com/docs/authentication` — Login endpoint, request/response format
- `https://simplejwtlogin.com/docs/refresh-token` — Refresh endpoint, request/response format
- `https://simplejwtlogin.com/docs/code_examples/php/register_and_get_jwt` — Registration endpoint, parameters

### Secondary (MEDIUM confidence)
- `https://npmjs.com/package/cookie-parser` — Express cookie-parser API
- `https://www.bezkoder.com/react-refresh-token/` — React token refresh pattern (multiple cross-references)
- `https://blog.galmalachi.com/react-and-jwt-authentication-the-right-way` — In-memory token + timer pattern
- `https://medium.com/@alperkilickaya/creating-a-jwt-authentication-system-with-http-only-refresh-token-using-react-and-node-js-6865f04087ce` — Full stack httpOnly cookie + React pattern

### Tertiary (LOW confidence — flag for validation)
- Simple JWT Login `exp` behavior when refreshing an expired token — inferred from docs, not directly confirmed by official source
- WooCommerce user role assigned by Simple JWT Login `/v1/users` endpoint — not confirmed in docs reviewed

---

## Metadata

**Confidence breakdown:**
- Simple JWT Login endpoints: HIGH — verified against official docs (simplejwtlogin.com)
- httpOnly cookie Express pattern: HIGH — verified via npm docs + multiple independent sources
- React in-memory token pattern: MEDIUM — verified via multiple blog sources, no Context7 entry for this
- Registration role/TTL config: LOW — not directly documented in sources reviewed
- Cross-domain staging cookie behavior: LOW — depends on deployment topology not yet confirmed

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (Simple JWT Login is a stable plugin; patterns are stable)
