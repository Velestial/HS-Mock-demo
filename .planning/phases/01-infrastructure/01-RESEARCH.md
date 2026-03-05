# Phase 1: Infrastructure - Research

**Researched:** 2026-03-04
**Domain:** Express 5 proxy server, PM2 process management, CORS allowlist, WooCommerce REST API, VPS deployment
**Confidence:** HIGH (core stack) / MEDIUM (VPS-specific Nginx config)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Deployment Target**
- Primary target: TitanHostingHub VPS (SSH access confirmed)
- Process manager: PM2 to keep Node.js process alive and manage env vars in production
- API exposed on a separate subdomain: `api.heyskipper.com`
- Frontend references server via `VITE_API_URL` environment variable (set per environment)
- Fallback if TitanHostingHub denies Node.js: **Railway** (Git-push deploys)

**Proxy Behavior**
- Light transformation — shape WooCommerce responses to match frontend TypeScript types (strip unused fields, rename keys)
- Errors normalized to a consistent shape: `{ error: true, code: "...", message: "..." }` regardless of what WooCommerce returns
- Authentication: server-to-server only — WC Consumer Key + Secret attached to every proxied request; never exposed to the client
- Full request logging in production: every incoming request logged with method, path, and response status

**Local Dev Workflow**
- Single command: `npm run dev` starts both Vite frontend and Express server via `concurrently`
- Vite proxy: in dev, Vite forwards `/api` requests to Express so everything runs on one port (`:5173`)
- Express auto-restart: `nodemon` watches `server/` directory and restarts on file changes
- Server secrets isolated in `server/.env` (separate from frontend `.env.local`)

**Environment & Secrets Management**
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

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within Phase 1 scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | Express API server is fully implemented with all endpoints (products, orders, customers, payments, auth) | Express 5 route structure, WooCommerce REST API endpoint mapping, `@woocommerce/woocommerce-rest-api` client |
| INFRA-02 | Server deployed to TitanHostingHub and accessible from frontend on staging domain | PM2 ecosystem config, Nginx reverse proxy subdomain config, process management patterns |
| INFRA-03 | CORS origin allowlist configured for production and staging domains only (not open wildcard) | `cors` package dynamic origin callback pattern — verified from official docs |
</phase_requirements>

---

## Summary

Phase 1 builds an Express 5 proxy server from a stub (`server/index.cjs`) into a fully functional API gateway. The existing stub has only a health check and open CORS — all proxy routes, WooCommerce authentication, response transformation, and environment validation need to be implemented from scratch. This is a greenfield server build, not a refactor.

The stack is already partially installed: `express`, `cors`, and `@woocommerce/woocommerce-rest-api` are in `package.json`. Express 5 is the installed version (`^5.2.1`), which introduces critical changes from Express 4 — primarily that async route handlers no longer need `try/catch` around `await` calls; rejected promises automatically forward to error handlers. This simplifies proxy route code significantly.

Deployment on TitanHostingHub requires Nginx as a reverse proxy in front of Node (standard VPS pattern: Nginx handles 80/443, proxies to Node on :3000). PM2 manages the process and holds production secrets in `ecosystem.config.js` using `env_staging` and `env_production` blocks. The TitanHostingHub Node.js support question is a live blocker that the user must resolve before deployment — Railway is the confirmed fallback.

**Primary recommendation:** Build the full Express 5 server in `server/index.cjs`, implement all WooCommerce proxy routes using `@woocommerce/woocommerce-rest-api`, configure CORS with a dynamic origin callback, add Morgan for request logging, then deploy to VPS behind Nginx with PM2.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| express | ^5.2.1 (already installed) | HTTP server and routing | Already in package.json; v5 has async error handling built-in |
| cors | ^2.8.6 (already installed) | CORS middleware | Official Express middleware; supports dynamic origin callback for allowlists |
| @woocommerce/woocommerce-rest-api | ^1.0.2 (already installed) | WooCommerce REST API client | Official WooCommerce SDK; handles Consumer Key/Secret auth, HTTPS, request signing |
| morgan | ~1.10.0 (needs install) | HTTP request logger | Standard Express logging middleware; built-in format tokens; NODE_ENV conditional format |
| dotenv | ^17.2.4 (already installed) | Local env file loading | Already used via dotenvx; not needed in prod (PM2 handles it) |

### Supporting (Development Only)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| concurrently | ~8.x (needs install) | Run Vite + Express simultaneously | `npm run dev` single command; already planned |
| nodemon | ~3.x (needs install) | Auto-restart Express on file change | Development only; watches `server/` directory |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| morgan | Winston | Winston is a full logging framework; morgan is purpose-built for HTTP request logs and has zero config overhead — right tool for this phase |
| @woocommerce/woocommerce-rest-api | axios with manual OAuth | The WC SDK handles OAuth signing, request formation, and pagination; manual axios means re-implementing all of that |
| PM2 ecosystem.config.js | `.env` file on VPS disk | PM2 approach means secrets never touch the filesystem in production; more secure and standard for Node on VPS |

**Installation (missing packages):**
```bash
npm install --save morgan
npm install --save-dev concurrently nodemon
```

---

## Architecture Patterns

### Recommended Project Structure
```
server/
├── index.cjs          # Entry point — app setup, middleware, starts listening
├── routes/
│   ├── products.cjs   # GET /api/products
│   ├── orders.cjs     # POST /api/create-order, POST /api/update-order
│   ├── customers.cjs  # POST /api/login, GET /api/customer/:id, GET /api/customer/:id/orders
│   ├── payments.cjs   # POST /api/create-payment-intent
│   └── auth.cjs       # Reserved for Phase 2 JWT routes
├── middleware/
│   ├── cors.cjs       # CORS allowlist config
│   └── errorHandler.cjs # Normalized error shape { error: true, code, message }
└── .env.example       # All required var names with placeholder values
```

### Pattern 1: WooCommerce Client Initialization
**What:** Initialize the WooCommerce REST API client once at module level with Consumer Key/Secret from env
**When to use:** All WooCommerce proxy routes import this shared instance

```javascript
// server/woocommerce.cjs
// Source: https://www.npmjs.com/package/@woocommerce/woocommerce-rest-api
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

const api = new WooCommerceRestApi({
  url: process.env.WC_URL,
  consumerKey: process.env.WC_CONSUMER_KEY,
  consumerSecret: process.env.WC_CONSUMER_SECRET,
  version: 'wc/v3'
});

module.exports = api;
```

### Pattern 2: Express 5 Async Route Handlers (No Try/Catch Required)
**What:** Express 5 automatically forwards rejected async promises to error handlers
**When to use:** All proxy routes — eliminates boilerplate try/catch on every route

```javascript
// Source: https://expressjs.com/en/guide/migrating-5.html
// Express 5 — async errors auto-forwarded to error handler
router.get('/products', async (req, res) => {
  const response = await api.get('products', { per_page: 100 });
  const shaped = response.data.map(shapeProduct);
  res.json(shaped);
});
// If api.get() throws, Express 5 automatically calls next(err)
```

### Pattern 3: CORS Dynamic Origin Allowlist
**What:** Validate request origin against an array; reject non-listed origins with an error
**When to use:** Applied globally on the Express app before all routes

```javascript
// Source: https://expressjs.com/en/resources/middleware/cors.html
const cors = require('cors');

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,          // e.g. https://heyskipper.com
  process.env.FRONTEND_STAGING_URL,  // e.g. https://staging.heyskipper.com
  'http://localhost:5173',            // Vite dev server
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, curl, Postman)
    if (!origin || ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,   // Required for httpOnly cookie-based auth (Phase 2)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
```

### Pattern 4: Normalized Error Handler
**What:** Catch-all error middleware that normalizes all errors to the agreed shape
**When to use:** Registered LAST in Express middleware chain (after all routes)

```javascript
// Normalized error shape: { error: true, code: "...", message: "..." }
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || err.response?.status || 500;
  res.status(status).json({
    error: true,
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'An unexpected error occurred',
  });
});
```

### Pattern 5: Morgan Request Logging with NODE_ENV
**What:** Use 'combined' format in production (full Apache log), 'dev' in development
**When to use:** Added early in middleware chain, before routes

```javascript
// Source: https://expressjs.com/en/resources/middleware/morgan.html
const morgan = require('morgan');

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  app.use(morgan('combined'));  // :method :url :status :response-time ms
} else {
  app.use(morgan('dev'));       // Colorized, concise — for local terminal
}
```

### Pattern 6: PM2 Ecosystem Config with Environment-Specific Secrets
**What:** Store all secrets in PM2 ecosystem file, never in a disk `.env` in production
**When to use:** Production and staging deployments on VPS

```javascript
// ecosystem.config.js — committed to repo WITHOUT real secrets
// Source: https://pm2.keymetrics.io/docs/usage/application-declaration/
module.exports = {
  apps: [{
    name: 'hey-skipper-api',
    script: './server/index.cjs',
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
    },
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 3000,
      WC_URL: 'https://heyskipper.com',
      WC_CONSUMER_KEY: 'REPLACE_WITH_REAL_KEY',
      WC_CONSUMER_SECRET: 'REPLACE_WITH_REAL_SECRET',
      FRONTEND_URL: 'https://heyskipper.com',
      FRONTEND_STAGING_URL: 'https://staging.heyskipper.com',
      STRIPE_SECRET_KEY: 'REPLACE_WITH_REAL_KEY',
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      // ... same keys, production values
    }
  }]
};
// Start: pm2 start ecosystem.config.js --env staging
```

**IMPORTANT:** The `ecosystem.config.js` committed to git should have `REPLACE_WITH_REAL_KEY` placeholders. Real secrets are injected on the VPS directly. The file committed is a template, not a secrets store.

### Pattern 7: Startup Fast-Fail on Missing Env Vars
**What:** Check all required variables at startup, throw with a list of missing names
**When to use:** Very first thing in `server/index.cjs` before any other logic

```javascript
// No external library needed
const REQUIRED_ENV = [
  'WC_URL',
  'WC_CONSUMER_KEY',
  'WC_CONSUMER_SECRET',
  'STRIPE_SECRET_KEY',
  'FRONTEND_URL',
  'NODE_ENV',
];

const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error('Missing required environment variables:', missing.join(', '));
  process.exit(1);
}
```

### Pattern 8: Nginx Reverse Proxy for Subdomain Routing
**What:** Nginx listens on 443 for `api.heyskipper.com`, proxies to Node on localhost:3000
**When to use:** VPS deployment on TitanHostingHub; required to route subdomain to process

```nginx
# /etc/nginx/sites-available/api.heyskipper.com
# Source: https://blog.tericcabrel.com/deploy-a-node-js-application-with-pm2-and-nginx/
server {
    listen 80;
    server_name api.heyskipper.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.heyskipper.com;

    ssl_certificate /etc/letsencrypt/live/api.heyskipper.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.heyskipper.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Pattern 9: Local Dev — concurrently + Vite Proxy
**What:** Single `npm run dev` starts both Vite (port 5173) and Express (port 3000); Vite proxies `/api` to Express
**When to use:** Development only

```json
// package.json scripts additions
{
  "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
  "dev:client": "dotenvx run -f .env.local -- vite",
  "dev:server": "dotenvx run -f server/.env -- nodemon --watch server server/index.cjs"
}
```

Vite proxy (already exists in `vite.config.ts`):
```typescript
// Already correct — no change needed
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
},
```

### Anti-Patterns to Avoid
- **Open CORS wildcard (`origin: '*'`):** The existing stub uses this — it will be replaced with the allowlist pattern above. Wildcard CORS also prevents `credentials: true` from working, breaking Phase 2 httpOnly cookie auth.
- **Storing WC credentials in client-side code:** Consumer Key and Secret must only ever exist in `server/.env` or PM2 config. Never in any `VITE_` prefixed variable.
- **Putting try/catch on every async route in Express 5:** Express 5 handles this automatically. Adding try/catch everywhere is Express 4 habit and adds noise.
- **Running Node without PM2 on the VPS:** A bare `node server/index.cjs` will die on any unhandled error with no restart. PM2 is required for process persistence.
- **Committing `server/.env` with real values:** Must be in `.gitignore`. The `server/.env.example` is what gets committed.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| WooCommerce API auth (Consumer Key/Secret) | Manual axios with auth headers | `@woocommerce/woocommerce-rest-api` | The SDK handles OAuth 1.0a, HTTPS Basic Auth, request URL formation, pagination — non-trivial to replicate correctly |
| HTTP request logging | `console.log` in every route handler | `morgan` middleware | Morgan captures timing, status codes, and bytes automatically; impossible to get accurately with manual logging |
| Process resurrection on crash | `forever`, shell scripts | PM2 | PM2 handles startup on boot (`pm2 startup`), cluster mode, log rotation, and ecosystem file management |
| CORS origin validation logic | Custom middleware with regex | `cors` npm package | Edge cases around preflight OPTIONS requests, `Access-Control-Allow-Credentials`, vary headers — `cors` handles all of it |

**Key insight:** The WooCommerce REST API client is particularly important — OAuth 1.0a signing has subtle timestamp and nonce requirements that are easy to get wrong; the official package is the safe path.

---

## Common Pitfalls

### Pitfall 1: Express 5 Wildcard Route Syntax Changed
**What goes wrong:** `app.get('/*', handler)` silently fails to match in Express 5
**Why it happens:** Express 5 requires named wildcards — `/*splat` not `/*`
**How to avoid:** Use explicit named wildcards or specific path patterns; don't use catch-all wildcards for the proxy
**Warning signs:** Routes defined with `/*` return 404 even when the path looks correct

### Pitfall 2: CORS Rejects Same-Origin Server Requests
**What goes wrong:** Health check monitoring tools, curl, Postman get CORS errors
**Why it happens:** The `origin` callback receives `undefined` for non-browser clients; without the `!origin` guard, they get rejected
**How to avoid:** The Pattern 3 example above includes `if (!origin || ...)` — keep this guard
**Warning signs:** `pm2 monit` health checks fail; API testers get blocked

### Pitfall 3: PM2 Ecosystem File Committed with Real Secrets
**What goes wrong:** Real WC Consumer Key/Secret or Stripe Secret Key ends up in git history
**Why it happens:** Confusion between "template committed to git" vs "populated file on VPS"
**How to avoid:** Commit `ecosystem.config.js` with `REPLACE_WITH_REAL_KEY` placeholders. On the VPS, edit the file in-place and never push that version. Alternatively, have PM2 read from a separate secrets file not in git.
**Warning signs:** `git diff` shows real API keys in ecosystem file

### Pitfall 4: WooCommerce Pagination Default is 10 Items
**What goes wrong:** `GET /api/products` returns only 10 products even when the store has more
**Why it happens:** WooCommerce REST API defaults to `per_page=10`
**How to avoid:** Always pass `per_page=100` on the products endpoint. REQUIREMENTS.md DATA-01 explicitly calls this out.
**Warning signs:** Frontend shows incomplete product catalog; missing products in category pages

### Pitfall 5: Port Conflicts Prevent `npm run dev` from Starting
**What goes wrong:** Express fails to bind to port 3000 because something else is using it
**Why it happens:** A previous nodemon instance didn't terminate cleanly
**How to avoid:** Add `PORT=3000` to `server/.env.example`; use `lsof -i :3000` to diagnose; add graceful shutdown to Express
**Warning signs:** `EADDRINUSE :3000` in terminal output

### Pitfall 6: `server/.env` Not in `.gitignore` Causes Credential Leak
**What goes wrong:** Real WooCommerce credentials committed to git
**Why it happens:** `.gitignore` was not updated when `server/` directory was created
**How to avoid:** Add `server/.env` to `.gitignore` as one of the very first tasks
**Warning signs:** `git status` shows `server/.env` as a new tracked file

### Pitfall 7: CORS `credentials: true` Incompatible with Open Wildcard
**What goes wrong:** Phase 2 auth (httpOnly cookie) will silently fail if CORS is configured with `origin: '*'`
**Why it happens:** The browser spec forbids `Access-Control-Allow-Credentials: true` with `Access-Control-Allow-Origin: *`
**How to avoid:** The allowlist pattern (Pattern 3) is required from Phase 1 — not optional. `credentials: true` must be in corsOptions now so Phase 2 doesn't require a CORS rewrite.
**Warning signs:** Phase 2 refresh tokens silently fail to attach; 401 on every protected route

---

## Code Examples

### Complete server/index.cjs Skeleton

```javascript
// Source: patterns verified from expressjs.com/en/guide/migrating-5.html and morgan docs
'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Fast-fail on missing env vars
const REQUIRED_ENV = ['WC_URL', 'WC_CONSUMER_KEY', 'WC_CONSUMER_SECRET', 'STRIPE_SECRET_KEY', 'FRONTEND_URL', 'NODE_ENV'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error('STARTUP ERROR: Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

// CORS allowlist — must come before all routes
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_STAGING_URL,
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Request logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body parsing
app.use(express.json());

// Routes
app.use('/api', require('./routes/health.cjs'));
app.use('/api', require('./routes/products.cjs'));
app.use('/api', require('./routes/orders.cjs'));
app.use('/api', require('./routes/customers.cjs'));
app.use('/api', require('./routes/payments.cjs'));
app.use('/api', require('./routes/auth.cjs'));  // Stub for Phase 2

// Normalized error handler (must be last)
app.use((err, req, res, next) => {
  const status = err.status || err.response?.status || 500;
  res.status(status).json({
    error: true,
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'Unexpected error',
  });
});

app.listen(port, () => {
  console.log(`[${process.env.NODE_ENV}] Hey Skipper API running on port ${port}`);
});
```

### Products Route with WooCommerce Client

```javascript
// server/routes/products.cjs
'use strict';

const router = require('express').Router();
const api = require('../woocommerce.cjs');

// Express 5: no try/catch needed — async errors auto-forward to error handler
router.get('/products', async (req, res) => {
  const response = await api.get('products', { per_page: 100, status: 'publish' });
  const products = response.data.map(shapeProduct);
  res.json(products);
});

// Shape WC product to match frontend Product type in types.ts
function shapeProduct(wc) {
  return {
    id: String(wc.id),
    name: wc.name,
    description: wc.short_description || wc.description,
    price: parseFloat(wc.price) || 0,
    image: wc.images?.[0]?.src || '',
    images: wc.images?.map(img => img.src) || [],
    specs: wc.meta_data?.find(m => m.key === 'specs')?.value || '',
    categoryId: mapCategory(wc.categories),
    subtitle: wc.meta_data?.find(m => m.key === 'subtitle')?.value || undefined,
    tag: wc.tags?.[0]?.name || undefined,
    isFinalChance: wc.meta_data?.find(m => m.key === 'is_final_chance')?.value === 'yes',
  };
}

module.exports = router;
```

### server/.env.example

```bash
# WooCommerce API — server-to-server, NEVER expose to client
WC_URL=https://heyskipper.com
WC_CONSUMER_KEY=ck_your_consumer_key_here
WC_CONSUMER_SECRET=cs_your_consumer_secret_here

# Stripe — secret key only; publishable key goes in frontend .env.local
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# CORS allowed origins (comma-separated is fine if you parse in code, or separate vars)
FRONTEND_URL=http://localhost:5173
FRONTEND_STAGING_URL=http://localhost:5173

# Runtime environment
NODE_ENV=development
PORT=3000
```

---

## API Endpoint Map

The frontend `services/api.ts` calls these routes — all must be implemented in Phase 1:

| Frontend Call | Express Route | WC Endpoint | Notes |
|---------------|---------------|-------------|-------|
| `GET /api/health` | `GET /api/health` | — | Returns `{ status: 'ok', timestamp }` |
| `GET /api/products` | `GET /api/products` | `GET wc/v3/products` | Always `per_page=100` |
| `POST /api/create-order` | `POST /api/create-order` | `POST wc/v3/orders` | Forward cart line items |
| `POST /api/update-order` | `POST /api/update-order` | `PUT wc/v3/orders/:id` | Status + transaction_id |
| `POST /api/create-payment-intent` | `POST /api/create-payment-intent` | Stripe API (not WC) | Returns `{ clientSecret }` |
| `POST /api/login` | `POST /api/login` | Simple JWT Login (Phase 2 handles auth detail) | Phase 1: stub that returns 501 |
| `GET /api/customer/:id` | `GET /api/customer/:id` | `GET wc/v3/customers/:id` | Strip PII per AUTH-06 |
| `GET /api/customer/:id/orders` | `GET /api/customer/:id/orders` | `GET wc/v3/orders?customer=:id` | |
| `GET /api/customer/:id/downloads` | `GET /api/customer/:id/downloads` | `GET wc/v3/customers/:id/downloads` | |
| `PUT /api/customer/:id` | `PUT /api/customer/:id` | `PUT wc/v3/customers/:id` | |

**Note on auth route in Phase 1:** The `/api/login` route should be stubbed to return HTTP 501 (Not Implemented) in Phase 1. This prevents 404s without implementing auth logic that Phase 2 owns.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Express 4 try/catch on every async route | Express 5 auto-forwards rejected promises | Express 5.0 (Oct 2024) | ~30% less boilerplate in route handlers |
| `res.send(body, status)` | `res.status(status).send(body)` | Express 5 | Method signature change — must update any old pattern |
| `app.get('/*', handler)` | `app.get('/*splat', handler)` | Express 5 | Wildcard routes silently break if not renamed |
| `cors({ origin: '*' })` | `cors({ origin: fn, credentials: true })` | Current auth requirements | Open wildcard incompatible with httpOnly cookies |
| Bare `node` process on VPS | PM2 with ecosystem.config.js | PM2 v5+ | Process resurrection, log rotation, env management |

**Deprecated/outdated:**
- `server/index.cjs` current stub: Has open CORS and no routes — must be replaced entirely
- `process.env` via dotenvx in dev: Fine for local; PM2 ecosystem is the production path

---

## Open Questions

1. **TitanHostingHub Node.js Support**
   - What we know: SSH access confirmed; blocker acknowledged in STATE.md
   - What's unclear: Whether Titan allows persistent Node.js processes or port binding
   - Recommendation: User must contact support BEFORE Phase 1 work on VPS deployment tasks begin. Server code can be written locally regardless — only the deployment tasks are blocked.

2. **WC `meta_data` field structure for product specs/subtitle**
   - What we know: Frontend `Product` type has `specs`, `subtitle`, `tag`, `isFinalChance` fields; WC standard fields don't include these
   - What's unclear: Whether these are stored as WC `meta_data` entries or as custom product attributes
   - Recommendation: Check WooCommerce admin for 1-2 products; inspect `meta_data` array from a raw WC API call to map the correct keys before building `shapeProduct()`. The transformation logic should be confirmed against real WC data, not assumed.

3. **Stripe payment intent route scope in Phase 1**
   - What we know: `POST /api/create-payment-intent` is called from frontend and must return non-404
   - What's unclear: Whether Phase 1 should implement full Stripe logic or a functional stub
   - Recommendation: Implement the basic Stripe `paymentIntents.create()` call in Phase 1 since Stripe package is already installed. Full webhook handling (PAY-01) is Phase 3 — don't add that.

---

## Sources

### Primary (HIGH confidence)
- https://expressjs.com/en/guide/migrating-5.html — Express 5 breaking changes, async error handling, wildcard syntax
- https://expressjs.com/en/resources/middleware/cors.html — CORS dynamic origin callback pattern
- https://pm2.keymetrics.io/docs/usage/application-declaration/ — PM2 ecosystem.config.js env_staging/env_production structure
- https://expressjs.com/en/resources/middleware/morgan.html — Morgan format tokens and NODE_ENV conditional configuration
- https://woocommerce.github.io/woocommerce-rest-api-docs/ — WooCommerce REST API v3 endpoints and Consumer Key/Secret auth

### Secondary (MEDIUM confidence)
- https://blog.tericcabrel.com/deploy-a-node-js-application-with-pm2-and-nginx/ — PM2 + Nginx VPS deployment pattern (multiple sources corroborate)
- https://betterstack.com/community/guides/scaling-nodejs/nodejs-reverse-proxy-nginx/ — Nginx subdomain reverse proxy config

### Tertiary (LOW confidence)
- TitanHostingHub Node.js support: Not independently verifiable — user must confirm directly

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already in package.json; versions confirmed; Express 5 docs verified
- Architecture: HIGH — patterns verified from official Express, PM2, and CORS docs
- WooCommerce endpoint mapping: HIGH — official WC REST API docs; `per_page=100` requirement explicit in REQUIREMENTS.md
- VPS Nginx config: MEDIUM — standard pattern confirmed by multiple credible sources; specific Titan behavior unknown
- Product response shaping (meta_data keys): LOW — depends on real WC store data not accessible during research

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (stable libraries; Nginx/PM2 patterns are long-lived)
