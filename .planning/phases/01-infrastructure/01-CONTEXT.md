# Phase 1: Infrastructure - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Build and deploy a live Express proxy server on TitanHostingHub (VPS) staging with all API endpoints functional (auth, products, orders, customers, payments) and CORS locked to the correct domains. The server proxies WooCommerce REST API calls, hiding credentials and shaping responses for the React frontend. No auth logic, no payment hardening — that is Phase 2 and 3.

</domain>

<decisions>
## Implementation Decisions

### Deployment Target
- Primary target: TitanHostingHub VPS (SSH access confirmed)
- Process manager: PM2 to keep Node.js process alive and manage env vars in production
- API exposed on a separate subdomain: `api.heyskipper.com`
- Frontend references server via `VITE_API_URL` environment variable (set per environment)
- Fallback if TitanHostingHub denies Node.js: **Railway** (Git-push deploys)

### Proxy Behavior
- Light transformation — shape WooCommerce responses to match frontend TypeScript types (strip unused fields, rename keys)
- Errors normalized to a consistent shape: `{ error: true, code: "...", message: "..." }` regardless of what WooCommerce returns
- Authentication: server-to-server only — WC Consumer Key + Secret attached to every proxied request; never exposed to the client
- Full request logging in production: every incoming request logged with method, path, and response status

### Local Dev Workflow
- Single command: `npm run dev` starts both Vite frontend and Express server via `concurrently`
- Vite proxy: in dev, Vite forwards `/api` requests to Express so everything runs on one port (`:5173`)
- Express auto-restart: `nodemon` watches `server/` directory and restarts on file changes
- Server secrets isolated in `server/.env` (separate from frontend `.env.local`)

### Environment & Secrets Management
- Production secrets stored in PM2 ecosystem config (not a `.env` file on disk in production)
- `server/.env.example` committed to repo with all required variable names and placeholder values
- `server/.env` added to `.gitignore`
- Server fails loudly at startup if any required env var is missing — lists which variables are absent
- `NODE_ENV` variable used: `development` / `staging` / `production` — controls logging verbosity and behavior

### Claude's Discretion
- Exact response transformation shape for each endpoint (strip specific WC fields)
- Morgan vs custom logger for request logging
- PM2 ecosystem file structure
- Nginx/Apache reverse proxy config for subdomain routing on Titan VPS

</decisions>

<specifics>
## Specific Ideas

- Server startup guard: something like `const required = ['WC_CONSUMER_KEY', ...]; required.forEach(k => { if (!process.env[k]) throw new Error(...) })` — clear, simple, no external validation library needed
- The `api.heyskipper.com` subdomain approach means the CORS allowlist is straightforward: production frontend domain + staging domain

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within Phase 1 scope

</deferred>

---

*Phase: 01-infrastructure*
*Context gathered: 2026-03-04*
