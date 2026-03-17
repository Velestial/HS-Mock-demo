# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased] — 2026-03-06 — Phase 1: Infrastructure (In Progress)

### Added — Express Proxy Server
- `server/index.cjs` — full Express 5 proxy replacing the 14-line stub
  - Startup env guard: exits immediately with named missing vars before anything starts
  - Dynamic CORS allowlist with `credentials: true` (required for Phase 2 httpOnly cookie auth)
  - Morgan request logging (`dev` in development, `combined` in staging/production)
  - Normalized error handler: all errors return `{ error: true, code, message }`
- `server/woocommerce.cjs` — shared WooCommerce REST API client (server-to-server auth only)
- `server/routes/health.cjs` — `GET /api/health` → `{ status: 'ok', timestamp }`
- `server/routes/products.cjs` — `GET /api/products` proxies WC catalog with `per_page: 100`, shapes to frontend types
- `server/routes/orders.cjs` — `POST /api/create-order`, `POST /api/update-order`
- `server/routes/customers.cjs` — customer CRUD; PII stripped on GET (id, email, name only)
- `server/routes/payments.cjs` — `POST /api/create-payment-intent` via Stripe
- `server/routes/auth.cjs` — JWT auth stubs returning 501 Not Implemented (Phase 2 placeholder)
- `server/middleware/errorHandler.cjs` — standalone normalized error handler
- `server/.env.example` — all required env var names with placeholder values
- `ecosystem.config.js` — PM2 config with `env_staging` + `env_production` blocks (placeholder secrets only)

### Changed — Dev Workflow
- `package.json` — `npm run dev` now starts Vite + Express together via `concurrently` + `nodemon`
- `vite.config.ts` — `/api` proxy to `http://localhost:3000` for local development
- `.gitignore` — added `server/.env` and `dist/`

### Added — Frontend Prototype Refactor
- `context/ProductContext.tsx` — shared product state context
- `services/api.ts` — Axios instance with WooCommerce proxy endpoints
- `utils/productMapper.ts` — shapes WC API responses to frontend `Product` type
- `components/Lightbox.tsx` — product image gallery lightbox

### Changed — Frontend Components
- `context/AuthContext.tsx` — aligned with proxy server auth stubs
- `context/CartContext.tsx` — improved cart logic
- `components/CheckoutPage.tsx` — updated data flow via services/api
- `components/AccountPage.tsx`, `RodPage.tsx`, `TacklePage.tsx` — updated product integration
- `types.ts` — extended Product type with additional fields
- `data/products.ts` — revised seed data

### Planning
- `.planning/` — full GSD project initialized with 41 v1 requirements across 7 phases
- Roadmap: Infrastructure → Auth/Security → Data/Payments → Code Quality → Analytics/Integrations → Landing Pages → Order Tracking
- Research: stack, features, architecture, pitfalls, and codebase analysis documented

---

## [Unreleased] - 2026-02-04

### Added
- Cloudflare Turnstile integration on Checkout page.
- Emotive popup component (mock implementation).
- New product pages for bait items.
- Legal pages: Terms & Conditions, Privacy Policy, Rod Warranty.
- New "Shop All" page with filtering and sorting.
- Search functionality in Navbar.

### Changed
- Updated products list in `data/products.ts` (removed legacy e-books, updated bait prices).
- Refreshed Tackle Page with new products and images.
- Updated bundle prices.
- Fixed broken images on Bait Page.
- Implemented manual chunks in Vite config to resolve large chunk size warnings.

### Fixed
- Navigation issues to product pages.
