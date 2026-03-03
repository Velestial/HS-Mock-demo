# Technology Stack

**Analysis Date:** 2026-03-02

## Languages

**Primary:**
- TypeScript ~5.8.2 - Source code, React components, type definitions
- JavaScript (CommonJS) - Server runtime via Node.js

**Secondary:**
- JSX/TSX - React component templates
- CSS - Styling via Tailwind CSS (imported in `index.css`)

## Runtime

**Environment:**
- Node.js (version not specified in package.json, inferred from CommonJS server)

**Package Manager:**
- npm (version not specified)
- Lockfile: `package-lock.json` present (129KB)

## Frameworks

**Core:**
- React 19.2.4 - UI framework
- React DOM 19.2.4 - DOM rendering

**Build/Dev:**
- Vite 6.2.0 - Build tool and dev server
- @vitejs/plugin-react 5.0.0 - React Fast Refresh support

**Backend:**
- Express 5.2.1 - HTTP server framework (CommonJS, `server/index.cjs`)
- CORS 2.8.6 - Cross-Origin Resource Sharing middleware

**Build Output:**
- Built artifacts in `dist/` directory (generated)

## Key Dependencies

**Critical:**
- @stripe/react-stripe-js 5.6.0 - Stripe React integration for payment forms
- @stripe/stripe-js 8.7.0 - Stripe SDK for client-side payments
- stripe 20.3.1 - Stripe server-side SDK for backend payment processing

**Infrastructure:**
- axios 1.13.5 - HTTP client for API calls to backend
- dotenv 17.2.4 - Environment variable loading
- @dotenvx/dotenvx 1.52.0 - Enhanced dotenv for encrypted key management

**UI & Visualization:**
- lucide-react 0.563.0 - Icon library
- framer-motion 12.31.0 - Animation library for React
- leaflet 1.9.4 - Interactive mapping library
- react-leaflet 5.0.0 - React bindings for Leaflet
- @types/leaflet 1.9.21 - TypeScript types for Leaflet

**Security & Validation:**
- @marsidev/react-turnstile 1.4.2 - Cloudflare Turnstile bot protection widget

**E-commerce Integration:**
- @woocommerce/woocommerce-rest-api 1.0.2 - WooCommerce REST API client library

**Development:**
- @types/node 22.14.0 - TypeScript definitions for Node.js

## Configuration

**Environment:**
- `.env.local` - Local environment overrides (development)
- `server/.env` - Server-side environment (present but minimal)
- `server/.env.example` - Example server configuration with required vars:
  - `PORT` - Server port (default 3001 in example)
  - `WC_URL` - WooCommerce installation URL
  - `WC_CONSUMER_KEY` - WooCommerce REST API consumer key
  - `WC_CONSUMER_SECRET` - WooCommerce REST API consumer secret
  - `STRIPE_SECRET_KEY` - Stripe secret key for server-side payments
- `.env.keys` - dotenvx key management (encryption keys for env vars)

**Build:**
- `vite.config.ts` - Vite configuration with React plugin and API proxy
- `tsconfig.json` - TypeScript configuration targeting ES2022
- `.prettierrc` - Code formatting rules (not found, using defaults)
- `.eslintrc*` - Linting rules (not found, no linter configured)

**Development Tools:**
- `package.json` scripts:
  - `dev` - Runs Vite dev server with dotenvx env loading
  - `build` - Creates production build with dotenvx env loading
  - `preview` - Preview built output
  - `server` - Runs Express backend server

## Platform Requirements

**Development:**
- Node.js (version not specified)
- npm or compatible package manager
- Unix-like shell (uses `dotenvx run` with shell command chaining)

**Production:**
- Node.js runtime for Express server
- Vite build output (static assets + React app)
- Environment configuration (WooCommerce, Stripe, Turnstile, server port)

## Entry Points

**Frontend:**
- `index.html` - HTML entry point
- `main.tsx` - React application entry point
- `App.tsx` - Root React component

**Backend:**
- `server/index.cjs` - Express server entry point (port configurable via `PORT` env var, defaults to 3000)

## API Communication

**Frontend to Backend:**
- Vite proxy configured at `vite.config.ts` - `/api/*` requests routed to `http://localhost:3000`
- Axios HTTP client for requests to `/api/` endpoints

**Available Endpoints (from `services/api.ts`):**
- `POST /api/create-order` - Create WooCommerce order
- `POST /api/create-payment-intent` - Create Stripe payment intent
- `POST /api/update-order` - Update order status after payment
- `POST /api/login` - Customer login
- `GET /api/customer/{customerId}/orders` - Fetch customer orders
- `PUT /api/customer/{customerId}` - Update customer data
- `GET /api/customer/{customerId}/downloads` - Fetch customer downloads
- `GET /api/products` - Fetch product catalog
- `GET /api/health` - Server health check

---

*Stack analysis: 2026-03-02*
