---
phase: 01-infrastructure
plan: 02
subsystem: infra
tags: [pm2, ecosystem, nginx, vite-proxy, vps, titanhostinghub]

# Dependency graph
requires:
  - phase: 01-01
    provides: Express server at server/index.cjs with /api/health and all proxy routes
provides:
  - PM2 ecosystem.config.js with env_staging and env_production blocks (placeholder secrets)
  - Vite proxy /api -> http://localhost:3000 for local dev (already present, confirmed correct)
affects:
  - 02-auth
  - 03-payments

# Tech tracking
tech-stack:
  added: [pm2]
  patterns:
    - PM2 ecosystem file committed with REPLACE_WITH_REAL_* placeholders — real secrets injected on VPS, never pushed to git
    - env_staging and env_production blocks for targeted PM2 environment selection

key-files:
  created:
    - ecosystem.config.js
  modified: []

key-decisions:
  - "ecosystem.config.js committed to git with placeholder secrets only — real values injected directly on VPS and never committed"
  - "Vite proxy was already correctly configured pointing to http://localhost:3000 — no changes needed"

patterns-established:
  - "PM2 pattern: ecosystem.config.js at project root, started with --env staging or --env production"
  - "Secret hygiene: REPLACE_WITH_REAL_* placeholders in git, real values in-place on VPS"

requirements-completed: [INFRA-02]

# Metrics
duration: 5min
completed: 2026-03-05
---

# Phase 1 Plan 02: VPS Deployment Summary

**PM2 ecosystem.config.js created with staging/production env blocks and placeholder secrets; VPS deployment paused at human-action checkpoint awaiting SSH access to TitanHostingHub**

## Performance

- **Duration:** ~5 min (Task 1 only — paused at Task 2 checkpoint)
- **Started:** 2026-03-05T07:18:32Z
- **Completed:** 2026-03-05T07:22:00Z (partial — awaiting VPS deployment)
- **Tasks:** 1 of 3 complete
- **Files modified:** 1

## Accomplishments

- Created ecosystem.config.js with hey-skipper-api PM2 app, env_staging and env_production blocks, all secrets as REPLACE_WITH_REAL_* placeholders
- Confirmed vite.config.ts proxy block already correctly targets http://localhost:3000 (no changes needed)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create PM2 ecosystem config and verify Vite proxy** - `7dc92e8` (feat)
2. **Task 2: Deploy to TitanHostingHub VPS** - PENDING (human-action checkpoint)
3. **Task 3: Verify staging endpoint from browser** - PENDING (human-verify checkpoint)

## Files Created/Modified

- `ecosystem.config.js` - PM2 process definition with hey-skipper-api app, env_staging/env_production, placeholder secrets

## Decisions Made

- ecosystem.config.js committed with placeholder secrets only — real values are injected directly on VPS via `nano ecosystem.config.js` and that edited version is never pushed back to git
- Vite proxy was already correct from Plan 01 work — no changes were required

## Deviations from Plan

None - plan executed exactly as written for Task 1. Vite proxy was already correctly configured so no edit was required (expected outcome per plan instructions).

## Issues Encountered

None — Task 1 executed cleanly.

## User Setup Required

**VPS deployment requires manual SSH steps.** See Task 2 checkpoint below for complete instructions.

When you SSH into TitanHostingHub:
1. Clone/pull repo, run `npm install --production`
2. Edit ecosystem.config.js on VPS to replace REPLACE_WITH_REAL_* values with real secrets
3. `pm2 start ecosystem.config.js --env staging && pm2 save && pm2 startup`
4. Set up Nginx reverse proxy for api.heyskipper.com with SSL via certbot
5. Verify: `curl https://api.heyskipper.com/api/health` returns `{"status":"ok","timestamp":"..."}`

## Next Phase Readiness

- Task 1 complete: ecosystem.config.js ready for VPS deployment
- Tasks 2-3 blocked on human VPS SSH access (TitanHostingHub or Railway fallback)
- Once Tasks 2-3 complete, Phase 1 is fully done and Phase 2 auth can begin

---
*Phase: 01-infrastructure*
*Completed: 2026-03-05 (partial)*

## Self-Check: PASSED

- `ecosystem.config.js` found at project root
- Task 1 commit `7dc92e8` confirmed in git log
- Vite proxy confirmed at `vite.config.ts` lines 7-13
