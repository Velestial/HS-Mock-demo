# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-02)

**Core value:** A customer can discover HeySkipper fishing products through a beautiful, fast storefront and complete a purchase with confidence.
**Current focus:** Phase 1 - Infrastructure

## Current Position

Phase: 1 of 7 (Infrastructure)
Plan: 2 of 3 in current phase
Status: In progress — paused at Task 2 human-action checkpoint (VPS deployment)
Last activity: 2026-03-05 — Phase 1 Plan 02 Task 1 complete: PM2 ecosystem.config.js created; awaiting VPS SSH deployment

Progress: [█░░░░░░░░░] 7%

## Performance Metrics

**Velocity:**
- Total plans completed: 1 (01-02 partial — paused at checkpoint)
- Average duration: 15 min
- Total execution time: 20 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-infrastructure | 1 complete, 1 partial | 20 min | 15 min |

**Recent Trend:**
- Last 5 plans: 01-01 (15 min), 01-02 partial (5 min Task 1)
- Trend: baseline established

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

### Pending Todos

None yet.

### Blockers/Concerns

- **Phase 1 blocker (RESOLVED 2026-03-04):** server/index.cjs is a stub. Full Express server will be built in Phase 1.
- **Phase 1 blocker (ACTION REQUIRED):** TitanHostingHub Node.js support not yet confirmed. User will contact TitanHostingHub support to confirm Node.js + Git. Phase 1 architecture is designed for persistent Node.js; if denied, fallback to Vercel/Railway for Express proxy.
- **Phase 2 concern (RESOLVED 2026-03-04):** WooCommerce JWT plugin is **Simple JWT Login**. Auth flows in Phase 2 use Simple JWT Login endpoints.
- **Phase 6 concern:** Product-in-use photography availability for hero sections is unknown. Landing page hero design depends on whether full-bleed imagery exists.

## Session Continuity

Last session: 2026-03-05
Stopped at: 01-infrastructure/01-02-PLAN.md Task 2 — human-action checkpoint: VPS SSH deployment to TitanHostingHub required
Resume file: None
