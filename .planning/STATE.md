# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-02)

**Core value:** A customer can discover HeySkipper fishing products through a beautiful, fast storefront and complete a purchase with confidence.
**Current focus:** Phase 2 - Auth and Security

## Current Position

Phase: 2 of 7 (Auth and Security)
Plan: 3 of 3 in current phase (02-03 complete — Phase 2 DONE)
Status: Phase 2 complete — ready for Phase 3 (Payments)
Last activity: 2026-03-07 — Phase 2 Plan 03 complete: registration flow wired end-to-end, Turnstile on form, sessionLoading spinner, all 6 UAT tests passed

Progress: [████░░░░░░] 29%

## Performance Metrics

**Velocity:**
- Total plans completed: 4 (01-01, 02-01, 02-02, 02-03; 01-02 partial — paused at checkpoint)
- Average duration: 14 min
- Total execution time: 62 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-infrastructure | 1 complete, 1 partial | 20 min | 15 min |
| 02-auth-and-security | 3 complete | 42 min | 14 min |

**Recent Trend:**
- Last 5 plans: 01-02 partial (5 min Task 1), 02-01 (12 min), 02-02 (15 min), 02-03 (15 min)
- Trend: consistent 12-15 min per plan

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: Research identified 5 critical defects — Express server has no endpoints, auth stores full PII in localStorage, register() silently fails, product IDs resolve to 0 in checkout line items, no Stripe webhook exists. Phases 1-3 fix these before any feature work.
- [Init]: Build order is infrastructure-first by research mandate — no auth or payment work begins until Express server is confirmed functional.
- [Init]: Research flag for Phase 1: determine whether server/index.cjs is a stub or if a complete server exists elsewhere before rebuilding from scratch.
- [2026-03-04]: RESOLVED — server/index.cjs is confirmed a stub. Phase 1 builds the full Express server from scratch.
- [Init]: Research flag for Phase 2: confirm which WooCommerce JWT plugin is installed (jwt-authentication-for-wp-rest-api vs Simple JWT Login have different token formats).
- [2026-03-04]: RESOLVED — WooCommerce JWT plugin is **Simple JWT Login**. Auth implementation in Phase 2 uses Simple JWT Login token format.
- [2026-03-05]: Dynamic CORS origin callback used (not wildcard) — credentials:true requires explicit origin matching per browser spec.
- [2026-03-05]: Express 5 async handlers used without try/catch — unhandled promise rejections auto-forward to error handler.
- [2026-03-05]: Auth routes return 501 Not Implemented (not 404) to signal planned-but-not-yet-built endpoints to callers.
- [2026-03-05]: PII stripping on GET /customer/:id established in Phase 1 per AUTH-06, even though auth is Phase 2 scope.
- [2026-03-05]: ecosystem.config.js committed to git with REPLACE_WITH_REAL_* placeholders only — real secrets injected directly on VPS, never pushed to git.
- [2026-03-06]: cookie-parser mounted after express.json() and before all routes — ensures req.cookies is available in auth handlers.
- [2026-03-06]: hs_refresh is a session cookie (no maxAge) — expires when browser closes; sameSite Strict in dev, None in production (cross-domain).
- [2026-03-06]: Register handler does Step 1 (create WC user) then Step 2 (auto-login) — returns 201+token on success, 201+requiresLogin if auto-login fails.
- [2026-03-06]: Generic 401 INVALID_CREDENTIALS on bad login — raw WC error is never forwarded to avoid account existence leakage.
- [2026-03-07]: Access token stored in useRef (not useState) — avoids re-render on every token refresh, never lands in localStorage.
- [2026-03-07]: persistUser() writes only {id, email, first_name, last_name} to localStorage — no billing/shipping/phone per AUTH-06.
- [2026-03-07]: Schema version guard (v2) runs before refreshSession() on mount — ensures old PII data is evicted before any state is set.
- [2026-03-07]: logout() clears state synchronously before calling logoutUser() — user sees logged-out state immediately regardless of network.
- [Phase 02-auth-and-security]: Turnstile token is UX-only in Phase 2 — server-side verification deferred to Phase 3 per PAY-03
- [Phase 02-auth-and-security]: EMAIL_EXISTS error code forwarded verbatim from WC; client checks err.response.data.code and shows message directly
- [Phase 02-auth-and-security]: Duplicate email detection uses WC errorCode 38 (not string matching) for reliability

### Pending Todos

None yet.

### Blockers/Concerns

- **Phase 1 blocker (RESOLVED 2026-03-04):** server/index.cjs is a stub. Full Express server will be built in Phase 1.
- **Phase 1 blocker (ACTION REQUIRED):** TitanHostingHub Node.js support not yet confirmed. User will contact TitanHostingHub support to confirm Node.js + Git. Phase 1 architecture is designed for persistent Node.js; if denied, fallback to Vercel/Railway for Express proxy.
- **Phase 2 concern (RESOLVED 2026-03-04):** WooCommerce JWT plugin is **Simple JWT Login**. Auth flows in Phase 2 use Simple JWT Login endpoints.
- **Phase 6 concern:** Product-in-use photography availability for hero sections is unknown. Landing page hero design depends on whether full-bleed imagery exists.

## Session Continuity

Last session: 2026-03-07
Stopped at: Completed 02-auth-and-security/02-03-PLAN.md — Phase 2 complete, all 6 UAT tests passed, ready for Phase 3
Resume file: None
