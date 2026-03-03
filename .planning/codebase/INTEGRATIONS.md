# External Integrations

**Analysis Date:** 2026-03-02

## APIs & External Services

**Payment Processing:**
- Stripe - Payment gateway for credit card processing
  - SDK/Client: `@stripe/stripe-js` (8.7.0), `@stripe/react-stripe-js` (5.6.0), `stripe` (20.3.1 backend)
  - Auth: `STRIPE_SECRET_KEY` (server-side, configured via `server/.env`)
  - Usage: `components/CheckoutPage.tsx` handles card payment via `confirmCardPayment()`
  - Backend integration: Server calls Stripe API to create payment intents

**Security & Bot Protection:**
- Cloudflare Turnstile - CAPTCHA alternative for bot prevention
  - SDK/Client: `@marsidev/react-turnstile` (1.4.2)
  - Auth: Site key `1x00000000000000000000AA` (test key, hardcoded in `components/CheckoutPage.tsx` line 579)
  - Usage: Widget rendered on checkout form, validates user before payment submission

**Geolocation & Mapping:**
- Nominatim (OpenStreetMap) - Free geocoding API
  - API: `https://nominatim.openstreetmap.org/search`
  - Usage: `components/CheckoutPage.tsx` (lines 199-210) geocodes shipping address to display on map after successful checkout
  - Fallback: Center of US coordinates [39.8283, -98.5795] if geocoding fails

- Leaflet + OpenStreetMap - Interactive mapping display
  - SDK/Client: `leaflet` (1.9.4), `react-leaflet` (5.0.0)
  - Tiles: CartoDB Light tiles via `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
  - Usage: Success page displays shipping destination on interactive map

## Data Storage

**Primary Database:**
- WooCommerce (WordPress) - E-commerce platform
  - Connection: REST API endpoint configured via `WC_URL` environment variable
  - Client: `@woocommerce/woocommerce-rest-api` (1.0.2)
  - Auth: `WC_CONSUMER_KEY` and `WC_CONSUMER_SECRET` (configured in `server/.env`)
  - Data managed: Products, customers, orders, line items, shipping data

**Client-Side Storage:**
- Browser LocalStorage
  - `hey-skipper-cart` key - Shopping cart state persisted in `context/CartContext.tsx`
  - `heyskipper_user` key - User authentication state persisted in `context/AuthContext.tsx`

**File Storage:**
- Not detected - Product images referenced from static URLs

**Caching:**
- None detected

## Authentication & Identity

**Auth Provider:**
- Custom email-based authentication (no traditional OAuth/JWT detected)
  - Implementation: Magic link / email match style login via `context/AuthContext.tsx`
  - Endpoint: `POST /api/login` accepts email, returns WooCommerce customer object
  - Session: User object stored in localStorage as `heyskipper_user`
  - Password: Ignored in demo mode (comment on line 87 of `AuthContext.tsx`: "Password is ignored for this 'Magic Link' / 'Email Match' style demo login")
  - Note: Production would require WooCommerce JWT or similar for real authentication

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Browser console via `console.error()`, `console.log()` (development debugging)
- Server console output via Express
- No centralized logging service detected

## CI/CD & Deployment

**Hosting:**
- Not configured - Frontend builds to `dist/` directory
- Server runs locally on configured port

**CI Pipeline:**
- None detected

**Build Process:**
- Vite production build with environment variable injection
- Output: Static assets in `dist/` for frontend, CommonJS server in `server/`

## Environment Configuration

**Required Environment Variables (Frontend):**
- None required (Stripe publishable key typically would be here, but not found)
- Turnstile site key hardcoded in component

**Required Environment Variables (Server):**
From `server/.env.example`:
- `PORT` - Server listening port (defaults to 3000 if not set in `server/index.cjs`)
- `WC_URL` - WooCommerce installation URL (e.g., `https://your-wordpress-site.com`)
- `WC_CONSUMER_KEY` - WooCommerce REST API consumer key
- `WC_CONSUMER_SECRET` - WooCommerce REST API consumer secret
- `STRIPE_SECRET_KEY` - Stripe secret key for server-side payment processing

**Secrets location:**
- `server/.env` - Server environment file (contains secrets, git-ignored)
- Encrypted via `.env.keys` using dotenvx encryption

**Configuration Management:**
- dotenvx (`@dotenvx/dotenvx` 1.52.0) used for encrypted environment variable management
- Scripts use: `dotenvx run -f server/.env -f .env.local -- [command]`

## Webhooks & Callbacks

**Incoming:**
- Stripe payment webhooks - Not implemented (no webhook endpoints detected in server)

**Outgoing:**
- Stripe payment intent creation via client-side API
- WooCommerce order creation/update via REST API calls
- Nominatim geocoding API calls (read-only)

## Data Flow: Checkout Process

1. User adds items to cart (stored in localStorage via `CartContext`)
2. User navigates to checkout (`CheckoutPage.tsx`)
3. User fills address form and enters card details (Stripe CardElement)
4. User completes Turnstile CAPTCHA verification
5. On submit:
   - Create order in WooCommerce via `POST /api/create-order`
   - Create Stripe payment intent via `POST /api/create-payment-intent`
   - Confirm payment with Stripe via `stripe.confirmCardPayment()`
   - Update WooCommerce order status via `POST /api/update-order`
   - Geocode address via Nominatim
   - Display success page with map of shipping destination

## Security Considerations

**Payment Security:**
- Card details handled by Stripe.js (never sent to backend)
- PCI compliance delegated to Stripe
- Server-side payment processing with Stripe secret key

**Bot Protection:**
- Cloudflare Turnstile CAPTCHA on checkout form

**CORS:**
- Express CORS middleware configured in `server/index.cjs` (allows all origins in dev)

**API Authentication:**
- WooCommerce: Consumer key/secret for REST API calls
- Stripe: Secret key for server-side operations
- No frontend API key protection found (Stripe public key not visible, may be missing)

---

*Integration audit: 2026-03-02*
