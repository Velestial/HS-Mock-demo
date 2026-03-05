# Stack Research: HeySkipper New Integrations

**Research Date:** 2026-03-02
**Context:** Subsequent milestone — adding new integrations to existing React 19 + TypeScript + Vite + WooCommerce stack.

## WooCommerce JWT Authentication

**Plugin:** `Simple JWT Login` (confirmed by project owner 2026-03-04)
- **Install:** Already installed on WordPress backend
- **Confidence:** Confirmed

**Simple JWT Login token endpoints:**
- Login: `POST /wp-json/simple-jwt-login/v1/auth` with `{ email, password }`
- Returns: `{ success: true, data: { jwt: "...", user: {...} } }`
- Refresh: `POST /wp-json/simple-jwt-login/v1/auth/refresh`
- Revoke: `DELETE /wp-json/simple-jwt-login/v1/auth`

**Flow:**
1. Client POSTs to `/wp-json/simple-jwt-login/v1/auth` with `{ email, password }`
2. Plugin returns `{ data: { jwt } }` — note: field is `jwt`, not `token`
3. Access token stored in memory (React state); refresh token in httpOnly cookie via Express proxy
4. All WooCommerce API requests include `Authorization: Bearer <jwt>` header via Axios interceptor

**Frontend changes needed:**
- Update `AuthContext.tsx` `login()` to POST credentials and receive JWT from Simple JWT Login endpoint
- Update `services/api.ts` axios instance to attach `Authorization` header via interceptor
- Add `register()` function that calls `POST /wp-json/wc/v3/customers`, then auto-login

**What NOT to do:**
- Don't store JWT in localStorage (XSS risk) — access token in memory only
- Don't skip token expiry handling — implement refresh or re-login on 401
- Don't use the old `jwt-auth` plugin endpoint `/wp-json/jwt-auth/v1/token` — wrong plugin

**Server responsibility:** Express proxy handles cookie-based refresh token storage; client never sees refresh token directly.

---

## Stamped.io Reviews Integration

**Confidence:** Medium-High

**Integration method:** JavaScript widget embed (not a React npm package)

**How it works:**
```html
<!-- Stamped.io product reviews widget -->
<div id="stamped-main-widget"
  data-widget-type="main"
  data-product-id="{{product_id}}"
  data-product-title="{{product_title}}"
  data-product-url="{{product_url}}">
</div>
<script>
  !function(a,b,c,d,e,f,g,h){...}(window,document,'script','//stamped.io/widget.js?apiKey=YOUR_KEY');
</script>
```

**React integration pattern:**
```typescript
// useEffect to load Stamped script once, then re-initialize on product change
useEffect(() => {
  if (window.StampedFn) {
    window.StampedFn.init({ apiKey: import.meta.env.VITE_STAMPED_API_KEY });
  }
}, [productId]);
```

**Key considerations:**
- Load script once at app level (index.html or App.tsx)
- Re-init on route change to product page
- Stamped API key is PUBLIC (safe for client-side)
- Server-side: no backend changes needed (Stamped pulls reviews directly)

**Environment variable needed:** `VITE_STAMPED_API_KEY`

---

## Mailchimp Email Signup Integration

**Confidence:** High

**Recommended approach:** Mailchimp Embedded Form (no npm package needed)

**Option A — Mailchimp Embedded Form (simplest):**
- Generate form HTML from Mailchimp dashboard → Audience → Signup Forms → Embedded Forms
- Wrap in a React component, inject with `dangerouslySetInnerHTML` or convert to controlled form

**Option B — Custom React form → Mailchimp API (recommended for design control):**
```typescript
// POST to Mailchimp Members API via your Express proxy (avoids CORS + hides API key)
// server/index.cjs adds endpoint: POST /api/subscribe
// Body: { email, firstName? }
// Server calls: POST https://{dc}.api.mailchimp.com/3.0/lists/{listId}/members
```

**Why Option B:** Full control over design, no iframes, matches bento grid aesthetic.

**Environment variables needed (server-side only — never expose to client):**
- `MAILCHIMP_API_KEY`
- `MAILCHIMP_LIST_ID`
- `MAILCHIMP_DC` (data center prefix, e.g. `us21`)

**Placement recommendations:**
- Inline signup in hero sections of landing pages
- Footer newsletter signup
- Post-purchase thank you page popup

---

## Emotive.io SMS Opt-In Integration

**Confidence:** Medium

**Integration method:** JavaScript embed widget

**How it works:**
- Emotive provides a JS snippet that adds a popup/inline opt-in form
- At checkout, add Emotive's checkout SMS consent field

**Checkout integration:**
```typescript
// Add consent checkbox to CheckoutPage.tsx
<label>
  <input type="checkbox" name="sms_consent" />
  Get order updates and fishing deals via SMS. Msg & data rates apply.
</label>
// Pass phone + consent flag to Emotive via their JS API or server-side webhook
```

**Key considerations:**
- TCPA compliance required — must have explicit opt-in with consent language
- Emotive API key goes server-side (never client-side)
- Test with Emotive sandbox before production

**Environment variable needed (server-side):** `EMOTIVE_API_KEY`

---

## Performance Optimization (React/Vite)

**Confidence:** High

**Bundle splitting:**
```typescript
// vite.config.ts — manual chunks for large deps
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        stripe: ['@stripe/stripe-js'],
        framer: ['framer-motion'],
        leaflet: ['leaflet', 'react-leaflet']
      }
    }
  }
}
```

**Image optimization:**
- Use `vite-plugin-imagemin` or convert rod/bait images to WebP
- Lazy load images below fold: `<img loading="lazy" />`
- Use proper `width` + `height` attributes to prevent layout shift

**Code splitting (lazy loading routes):**
```typescript
const CheckoutPage = lazy(() => import('./components/CheckoutPage'));
const AccountPage = lazy(() => import('./components/AccountPage'));
// Wrap in <Suspense fallback={<Loading />}>
```

**What to avoid:**
- Don't lazy load above-the-fold content (slows LCP)
- Don't use `React.memo` everywhere — only on provably expensive components

---

## Recommended Environment Variable Structure

```bash
# Client-side (.env.local) — VITE_ prefix = exposed to browser
VITE_STAMPED_API_KEY=your_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Server-side (server/.env) — never exposed to browser
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...
STRIPE_SECRET_KEY=sk_live_...
MAILCHIMP_API_KEY=...
MAILCHIMP_LIST_ID=...
MAILCHIMP_DC=us21
EMOTIVE_API_KEY=...
JWT_SECRET=... (for validating WC JWT tokens on proxy)
```

---

*Research: 2026-03-02 | Confidence levels noted per finding*
