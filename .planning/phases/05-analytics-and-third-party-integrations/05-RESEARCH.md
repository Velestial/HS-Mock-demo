# Phase 5: Analytics and Third-Party Integrations — Research

**Researched:** 2026-03-10
**Domain:** GA4 gtag.js, Stamped.io widget SDK, Emotive.io SMS popup
**Confidence:** MEDIUM (GA4 HIGH, Stamped.io MEDIUM, Emotive.io LOW — public embed docs not found)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**GA4 — Events to track**
- Track all 5 ecommerce events: `view_item`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `purchase`
- Fire `page_view` automatically on every view change in App.tsx (not per-page manually)
- All events use the full GA4 ecommerce item schema: `item_id`, `item_name`, `item_category`, `price`, `quantity`

**GA4 — Configuration**
- Measurement ID stored as `VITE_GA4_MEASUREMENT_ID` environment variable
- Same pattern as Turnstile/Stripe keys — never hardcoded in source

**Stamped.io — Where it appears**
- Full reviews widget on **ProductPage** — renders below product info/specs section
- **Homepage carousel** of reviews — a Stamped.io reviews carousel widget embedded in the homepage (below existing sections)
- No reviews on category pages (BaitPage, RodPage, etc.)

**Stamped.io — Loading and empty state**
- Widget container is hidden until Stamped.io confirms reviews exist
- Zero reviews = section does not render at all (no spinner, no empty state message)
- Re-initialize widget when product changes (handles navigation between products)

**Stamped.io — Configuration**
- Store hash: `VITE_STAMPED_STORE_HASH` environment variable
- API key: `VITE_STAMPED_API_KEY` environment variable

**Emotive — Trigger and frequency**
- Popup triggers after a **5-second delay** on page load
- Frequency/suppression managed by Emotive's SDK (defer to their built-in logic — do not add custom localStorage suppression)

**Emotive — Widget style**
- Use **Emotive's default widget** via SDK embed — no custom CSS overriding their UI
- Remove the current custom-styled EmotivePopup.tsx mock entirely

**Emotive — TCPA consent**
- Use standard TCPA boilerplate language:
  > "By subscribing, you agree to receive recurring automated marketing text messages from HeySkipper at the number provided. Msg & data rates may apply. Reply STOP to opt out."

### Claude's Discretion
- Exact GA4 script loading strategy (gtag.js CDN vs npm package)
- Stamped.io script injection approach (CDN tag vs their JS SDK)
- Error handling if GA4 or Stamped.io scripts fail to load
- Where exactly in App.tsx the 5-second Emotive delay is implemented

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ANLT-01 | GA4 installed and tracking page views across all routes | GA4 utility module with `trackPageView()`, called from App.tsx on every `view` state change |
| ANLT-02 | Purchase events tracked with order value and product details on checkout success | `purchase` event fired in `useCheckoutSubmit.ts` inside `onSuccess` callback, using confirmed order data |
| ANLT-03 | Add-to-cart events tracked with product name and price | `add_to_cart` event fired inside `CartContext.addToCart()` with CartItem fields mapped to GA4 item schema |
| INT-01 | Stamped.io reviews widget displays product reviews on product pages and landing pages | `StampedFn.reloadUGC()` in ProductPage useEffect keyed to `product.id`; script loaded once via CDN |
| INT-02 | Stamped.io widget loads only when product has at least 1 review | `stamped:reviews:loaded` event listener hides/shows the container div; container starts hidden |
| INT-03 | Emotive.io SMS opt-in is functional at checkout — replaces non-functional EmotivePopup mock | Replace EmotivePopup.tsx with SDK script embed; 5s delay timer in App.tsx useEffect |
| INT-04 | Emotive.io opt-in includes proper TCPA consent language | TCPA text configured in Emotive dashboard; SDK renders it in default popup UI |
</phase_requirements>

---

## Summary

Phase 5 makes three existing integrations real: GA4 ecommerce tracking, Stamped.io product reviews, and the Emotive.io SMS popup. The project currently has a custom-built `EmotivePopup.tsx` mock that must be fully replaced. There is no routing library (no React Router) — the app uses a `view` state string in `App.tsx`, which means page_view tracking requires watching that state and calling `gtag('event', 'page_view', ...)` on change.

GA4 integration is well-documented with official Google sources. The recommended approach for this SPA is a `utils/analytics.ts` module that exports typed tracking functions, with the script dynamically injected into `<head>` and `send_page_view: false` to prevent double-counting. Stamped.io uses a CDN script + `StampedFn.init()` + HTML div with data attributes; re-initialization on product navigation is handled by `StampedFn.reloadUGC()` in a `useEffect`. The zero-reviews empty state is solved by listening to the `stamped:reviews:loaded` event and checking the rendered review count before showing the container.

Emotive.io's public embed documentation for non-Shopify sites is not publicly accessible. Their popup widget is normally a Shopify app, and the embed script is provided from within the Emotive dashboard after account setup. The implementation plan must account for this: the planner should create a task that loads a script tag from the Emotive-provided URL inside a `useEffect` with a 5-second delay, and removes the `EmotivePopup.tsx` mock. The exact script URL will be known only when the Emotive account is configured.

**Primary recommendation:** Implement GA4 with a typed `utils/analytics.ts` utility (no npm wrapper); use Stamped.io CDN script with `StampedFn.reloadUGC()` for product changes; replace EmotivePopup mock with a `useEffect` that injects Emotive's dashboard-provided script after a 5-second delay.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gtag.js (CDN) | latest (Google-managed) | GA4 event tracking | Official Google tag; no npm dependency needed; lighter than GA4 wrappers |
| @types/gtag.js | ~0.0.x (DefinitelyTyped) | TypeScript types for `window.gtag` | Official type definitions; avoids hand-rolled interface declarations |
| Stamped.io widget.min.js (CDN) | latest (Stamped-managed) | Reviews widget + carousel | Official SDK; no npm package exists; only method supported by their docs |
| Emotive embed script (dashboard-provided) | N/A | SMS opt-in popup | Only official embed method; URL is account-specific from Emotive dashboard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none beyond above) | — | — | All integrations are pure CDN scripts |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Raw gtag.js CDN | `react-ga4` npm package | npm package adds dependency/lag; raw gtag is simpler for this use case and avoids React Router assumption |
| `StampedFn.reloadUGC()` on product change | Re-mount widget component | Re-mounting risks full DOM teardown; `reloadUGC()` is the SDK's own re-init method (HIGH confidence) |

**Installation:**
```bash
npm install --save-dev @types/gtag.js
```
No runtime npm installs needed — all three integrations use CDN scripts loaded dynamically.

---

## Architecture Patterns

### Recommended Project Structure
```
utils/
└── analytics.ts         # GA4 init + all tracking functions (trackPageView, trackViewItem, trackAddToCart, etc.)

components/
└── widgets/
    └── EmotivePopup.tsx  # DELETE — replaced by useEffect in App.tsx or a thin wrapper component

hooks/
└── useCheckoutSubmit.ts  # ADD purchase event call inside onSuccess callback
```

### Pattern 1: GA4 Analytics Utility Module

**What:** A single `utils/analytics.ts` file handles script injection, initialization, and exports typed tracking functions. Called once from `main.tsx` (init) and from components/hooks as needed.

**When to use:** Any SPA with no router library. Keeps all GA4 logic isolated and testable.

**Example:**
```typescript
// Source: https://developers.google.com/analytics/devguides/collection/ga4/views
// utils/analytics.ts

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string;

export function initGA(): void {
  if (!GA_ID || typeof window === 'undefined') return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // CRITICAL: use arguments object, NOT spread — GA4 rejects true Arrays silently
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // send_page_view: false — we fire page_view manually on view changes
  window.gtag('config', GA_ID, { send_page_view: false });
}

export function trackPageView(path: string, title: string): void {
  if (!window.gtag) return;
  window.gtag('event', 'page_view', { page_path: path, page_title: title });
}
```

### Pattern 2: GA4 Ecommerce Events

**What:** Thin wrappers that map `CartItem` / `Product` / confirmed order data to GA4's item schema.

**When to use:** Called from `CartContext.addToCart`, `ProductPage` (view_item), `CartSidebar` (remove_from_cart), `CheckoutPage` (begin_checkout), `useCheckoutSubmit` (purchase).

**Example:**
```typescript
// Source: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
// utils/analytics.ts (continued)

interface GA4Item {
  item_id: string;
  item_name: string;
  item_category: string;
  price: number;
  quantity: number;
}

export function trackViewItem(product: { id: string; name: string; price: number; categoryId?: string }): void {
  if (!window.gtag) return;
  window.gtag('event', 'view_item', {
    currency: 'USD',
    value: product.price,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.categoryId ?? 'unknown',
      price: product.price,
      quantity: 1
    }]
  });
}

export function trackAddToCart(item: { id: string; name: string; price: number; category: string; quantity: number }): void {
  if (!window.gtag) return;
  window.gtag('event', 'add_to_cart', {
    currency: 'USD',
    value: item.price * item.quantity,
    items: [{
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity
    }]
  });
}

export function trackPurchase(orderId: number, value: number, items: GA4Item[], shipping: number, tax: number): void {
  if (!window.gtag) return;
  window.gtag('event', 'purchase', {
    transaction_id: String(orderId),
    value,
    currency: 'USD',
    shipping,
    tax,
    items
  });
}
```

### Pattern 3: page_view on view state change in App.tsx

**What:** `useEffect` watching `view` state calls `trackPageView` on every transition.

**When to use:** This app has no React Router — the view state IS the "page". The effect re-runs every time `view` changes.

**Example:**
```typescript
// App.tsx addition
useEffect(() => {
  const titles: Record<typeof view, string> = {
    'home': 'Home',
    'checkout': 'Checkout',
    'product': selectedProduct?.name ?? 'Product',
    // ... all view values
  };
  trackPageView(`/${view}`, titles[view] ?? view);
}, [view]);
```

### Pattern 4: Stamped.io widget with re-init on product change

**What:** Script loaded once via dynamic injection; widget div updated and `StampedFn.reloadUGC()` called in a `useEffect` keyed to `product.id`. Container hidden by default; shown only after `stamped:reviews:loaded` confirms reviews exist.

**When to use:** Any SPA that navigates between products without a full page reload.

**Example:**
```typescript
// ProductPage.tsx additions
// Source: https://stampedsupport.stamped.io/hc/en-us/articles/10152607118619-Javascript-Events-References

const [hasReviews, setHasReviews] = React.useState(false);

React.useEffect(() => {
  setHasReviews(false); // reset on product change

  const onLoaded = () => {
    // Check if any reviews were rendered
    const count = document.querySelectorAll('#stamped-main-widget .stamped-review').length;
    if (count > 0) setHasReviews(true);
  };

  document.addEventListener('stamped:reviews:loaded', onLoaded);

  if (typeof window !== 'undefined' && (window as any).StampedFn) {
    (window as any).StampedFn.reloadUGC();
  }

  return () => {
    document.removeEventListener('stamped:reviews:loaded', onLoaded);
  };
}, [product.id]);
```

Widget HTML (inside ProductPage JSX, hidden until `hasReviews` is true):
```jsx
{hasReviews && (
  <div
    id="stamped-main-widget"
    data-widget-type="standard"
    data-product-id={product.id}
    data-name={product.name}
    data-url={`https://heyskipper.com/product/${product.id}`}
    data-image-url={product.image}
    data-description={product.description}
    data-product-sku={product.id}
  />
)}
```

### Pattern 5: Stamped.io CDN script injection (once, in utils or App.tsx)

**What:** Load `widget.min.js` once and call `StampedFn.init()`. Must happen before any widget renders.

```typescript
// utils/stamped.ts
export function initStamped(): void {
  const apiKey = import.meta.env.VITE_STAMPED_API_KEY as string;
  const sId = import.meta.env.VITE_STAMPED_STORE_HASH as string;
  if (!apiKey || !sId) return;

  const script = document.createElement('script');
  script.src = 'https://cdn1.stamped.io/files/widget.min.js';
  script.type = 'text/javascript';
  script.onload = () => {
    (window as any).StampedFn.init({ apiKey, sId });
  };
  document.head.appendChild(script);
}
```

### Pattern 6: Stamped.io Homepage Carousel

**What:** A `<div id="stamped-reviews-widget" data-widget-type="carousel" />` placed in a new homepage section. Requires the same CDN script to already be loaded.

```jsx
// components/sections/StampedCarousel.tsx (new component)
// Source: https://stampedsupport.stamped.io/hc/en-us/articles/10097784538011
<div id="stamped-reviews-widget" data-widget-type="carousel" />
```

### Pattern 7: Emotive popup — replace mock with SDK embed

**What:** Remove `EmotivePopup.tsx` entirely. Use a `useEffect` in App.tsx (or a minimal wrapper component) that fires after 5 seconds, injecting the Emotive-provided script tag. Emotive's SDK renders and manages the popup UI natively.

**When to use:** When the Emotive script URL has been obtained from the Emotive dashboard.

**Example:**
```typescript
// In App.tsx, inside the component body:
React.useEffect(() => {
  const timer = setTimeout(() => {
    const script = document.createElement('script');
    // URL is obtained from Emotive dashboard — stored as env var or hardcoded after setup
    script.src = import.meta.env.VITE_EMOTIVE_SCRIPT_URL ?? '';
    script.async = true;
    if (script.src) document.body.appendChild(script);
  }, 5000);
  return () => clearTimeout(timer);
}, []);
```

### Anti-Patterns to Avoid

- **Using `window.gtag = (...args) => dataLayer.push(args)`:** The spread operator creates a true Array. GA4 requires the `arguments` object. This fails silently — tracking appears to work but beacons are rejected.
- **Double page_view**: If `send_page_view` is not set to `false` in the `gtag('config', ...)` call AND you manually fire `page_view`, every page loads will double-count the first view.
- **Re-mounting the Stamped widget component on product change**: Causes full DOM teardown. Use `StampedFn.reloadUGC()` instead.
- **Firing `purchase` event before Stripe confirmation**: The purchase event must only fire inside the `onSuccess` callback after `paymentIntent.status === 'succeeded'`.
- **Adding custom localStorage suppression to Emotive**: Decision locked — defer suppression to Emotive's own SDK logic.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Deduplicating GA4 script injection | Guard variable or state | `window.gtag` existence check before injection | Script tags loaded twice cause duplicate initialization |
| Review empty-state detection | Parse widget HTML | `stamped:reviews:loaded` event + DOM query for `.stamped-review` | SDK fires event when widget settles; DOM parsing is race-prone |
| Emotive frequency/suppression logic | Custom `localStorage` flag | Emotive SDK built-in logic | Locked decision; SDK handles cross-session suppression |
| GA4 item schema mapping | Custom event builder | `utils/analytics.ts` typed functions | Centralize schema so all call sites use the same field names |

**Key insight:** All three integrations are third-party CDN embeds — their SDKs own the complex state (popup frequency, review pagination, beacon transmission). Hand-rolling these creates a maintenance surface with no benefit.

---

## Common Pitfalls

### Pitfall 1: GA4 Silent Failure from Spread Operator
**What goes wrong:** Events appear to be sent (no console error) but GA4 never receives them.
**Why it happens:** `window.gtag = (...args) => dataLayer.push(args)` pushes a true Array; GA4 internal processing requires the `arguments` object (an array-like, not an Array).
**How to avoid:** Always write `window.gtag = function() { window.dataLayer.push(arguments); }` — never use arrow function or spread.
**Warning signs:** DebugView in GA4 shows no events even with network requests appearing successful.

### Pitfall 2: Double page_view on First Load
**What goes wrong:** GA4 counts 2 page views for every session (one automatic, one manual).
**Why it happens:** Default gtag config auto-sends `page_view` on load unless disabled.
**How to avoid:** Include `{ send_page_view: false }` in the `gtag('config', GA_ID, ...)` call. The `useEffect` watching `view` state fires on mount, supplying the first page_view manually.
**Warning signs:** Session page depth always appears double in GA4 reports.

### Pitfall 3: Stamped Widget Not Showing on Product Navigation
**What goes wrong:** Reviews appear on the first product opened but not on subsequent products navigated to without a page reload.
**Why it happens:** `StampedFn.init()` runs once; the widget div is replaced but Stamped doesn't know to re-scan the DOM.
**How to avoid:** Call `StampedFn.reloadUGC()` in a `useEffect` with `[product.id]` dependency whenever the product changes.
**Warning signs:** Reviews show for the first product only; console shows no Stamped errors.

### Pitfall 4: Stamped Widget Flashing Empty State
**What goes wrong:** An empty reviews section briefly appears before Stamped loads (or when a product has zero reviews).
**Why it happens:** Widget container is rendered before the SDK populates it.
**How to avoid:** Start with the container hidden (`hasReviews` state = false); show only after `stamped:reviews:loaded` fires AND at least one `.stamped-review` element exists in the DOM.
**Warning signs:** Brief empty-box flicker on product pages.

### Pitfall 5: Purchase Event Fires Before Payment Confirmed
**What goes wrong:** GA4 records purchases that were never completed (payment failed after event fired).
**Why it happens:** Calling `trackPurchase()` at the start of checkout flow instead of on confirmed success.
**How to avoid:** Fire `trackPurchase()` only inside the `onSuccess` callback in `useCheckoutSubmit.ts`, after `paymentIntent.status === 'succeeded'` is verified.
**Warning signs:** GA4 purchase count is higher than WooCommerce completed orders.

### Pitfall 6: Emotive Script Injected Multiple Times
**What goes wrong:** The Emotive popup appears multiple times per session.
**Why it happens:** `useEffect` with no dependency array runs on every re-render; or the component unmounts/remounts and injects a second script.
**How to avoid:** The `useEffect` must have an empty dependency array `[]` and a guard checking whether the script is already present. Or use a module-level flag.
**Warning signs:** Two popups visible simultaneously, or browser DevTools shows multiple Emotive script elements in `<body>`.

---

## Code Examples

Verified patterns from official sources:

### GA4 Init (with arguments object — HIGH confidence)
```typescript
// Source: https://www.mykolaaleksandrov.dev/posts/2025/11/react-google-analytics-implementation/
// Source: https://developers.google.com/analytics/devguides/collection/ga4/views

window.dataLayer = window.dataLayer || [];
window.gtag = function () { window.dataLayer.push(arguments); };
window.gtag('js', new Date());
window.gtag('config', GA_ID, { send_page_view: false });
```

### GA4 Purchase Event (HIGH confidence — official docs)
```typescript
// Source: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
window.gtag('event', 'purchase', {
  transaction_id: String(orderId),
  value: finalTotal,
  tax: taxAmount,
  shipping: shippingCost,
  currency: 'USD',
  items: confirmedOrder.items.map(item => ({
    item_id: item.id,
    item_name: item.name,
    item_category: item.category,
    price: item.price,
    quantity: item.quantity
  }))
});
```

### Stamped.io Init + Widget HTML (MEDIUM confidence — official support docs)
```html
<!-- Source: https://stampedsupport.stamped.io/hc/en-us/articles/9069569060891 -->
<script type="text/javascript" src="https://cdn1.stamped.io/files/widget.min.js"></script>
<script type="text/javascript">
  StampedFn.init({ apiKey: 'YOUR_PUBLIC_API_KEY', sId: 'YOUR_STORE_HASH' });
</script>

<!-- Product page widget -->
<div id="stamped-main-widget"
  data-widget-type="standard"
  data-product-id="PRODUCT_ID"
  data-name="PRODUCT_NAME"
  data-url="PRODUCT_URL"
  data-image-url="PRODUCT_IMAGE"
  data-description="PRODUCT_DESCRIPTION"
  data-product-sku="PRODUCT_SKU">
</div>

<!-- Homepage carousel widget -->
<div id="stamped-reviews-widget" data-widget-type="carousel"></div>
```

### Stamped.io Event Listener for Review Count (MEDIUM confidence — official JS events docs)
```typescript
// Source: https://stampedsupport.stamped.io/hc/en-us/articles/10152607118619
document.addEventListener('stamped:reviews:loaded', () => {
  const reviews = document.querySelectorAll('#stamped-main-widget .stamped-review');
  setHasReviews(reviews.length > 0);
});
// Reload widget when product changes
window.StampedFn.reloadUGC();
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom EmotivePopup mock (EmotivePopup.tsx) | Real Emotive SDK embed via script tag | Phase 5 | Eliminates dead UI; real opt-in data collected |
| No analytics | GA4 gtag.js with ecommerce events | Phase 5 | Full funnel visibility: browse → cart → purchase |
| No review social proof | Stamped.io product widget + homepage carousel | Phase 5 | Conversion lift from real reviews on product pages |

**Deprecated/outdated:**
- `EmotivePopup.tsx`: The entire file is deleted. EmotivePopup import in App.tsx is removed. Replaced by a `useEffect` injecting the real SDK script.
- Universal Analytics (UA/GA3): Fully sunset by Google in 2024. GA4 only.

---

## Open Questions

1. **Emotive embed script URL**
   - What we know: Emotive provides a dashboard-generated script URL per account; popup behavior and TCPA text are configured inside Emotive's dashboard, not in the embed code itself.
   - What's unclear: The exact script src URL format (e.g., `https://cdn.emotive.io/pixel/ACCOUNT_ID.js`). Public docs don't expose this — it requires an active Emotive account login to obtain.
   - Recommendation: Create a plan task that (a) provides a placeholder env var `VITE_EMOTIVE_SCRIPT_URL`, (b) injects it via the 5-second useEffect pattern, and (c) notes that the real URL is retrieved from the Emotive dashboard after account setup. The component code is complete; only the URL is pending.

2. **Stamped.io — `stamped:reviews:loaded` payload format**
   - What we know: The event fires when the widget settles. The JS events reference shows the event name and that it fires when "Reviews main widget loaded."
   - What's unclear: Whether the event detail includes a count or requires a DOM query to determine zero vs. non-zero reviews.
   - Recommendation: Use a DOM query (`document.querySelectorAll('#stamped-main-widget .stamped-review').length`) as the fallback detection method. LOW risk: if the class name differs, the widget will simply always show (harmless).

3. **Stamped.io — Carousel widget `data-widget-type` value**
   - What we know: The official "outside e-commerce platforms" guide shows `data-widget-type="full-page"` for a full page widget and implies `"carousel"` for the carousel type based on the Display Widgets showcase description.
   - What's unclear: Whether `data-widget-type="carousel"` is the exact string or a different value like `"reviews-carousel"`.
   - Recommendation: Use `data-widget-type="carousel"` per the showcase documentation (MEDIUM confidence). If it renders incorrectly, the Stamped dashboard "Get Code" button on the carousel widget will provide the authoritative value — note this in the plan task as a verification step.

---

## Sources

### Primary (HIGH confidence)
- https://developers.google.com/analytics/devguides/collection/ga4/ecommerce — All 5 ecommerce event schemas verified
- https://developers.google.com/analytics/devguides/collection/ga4/views — `send_page_view: false` and manual `page_view` pattern
- https://stampedsupport.stamped.io/hc/en-us/articles/9069569060891-Unsupported-or-Custom-Platform-Getting-Started — Custom platform init code

### Secondary (MEDIUM confidence)
- https://stampedsupport.stamped.io/hc/en-us/articles/10152607118619-Javascript-Events-References — `StampedFn.reloadUGC()`, `stamped:reviews:loaded` event
- https://stampedsupport.stamped.io/hc/en-us/articles/10152751296667-Main-Reviews-Widget-Customization-Attributes — `data-widget-type` and all data attributes
- https://www.mykolaaleksandrov.dev/posts/2025/11/react-google-analytics-implementation/ — `arguments` object pitfall, React utility module pattern

### Tertiary (LOW confidence)
- Emotive.io SDK embed URL format: not publicly documented; requires Emotive dashboard access. All research returned no public script URL or embed documentation.

---

## Metadata

**Confidence breakdown:**
- Standard stack (GA4): HIGH — verified against official Google developer docs
- Standard stack (Stamped.io): MEDIUM — verified against official Stamped support docs; carousel widget-type value not 100% confirmed
- Standard stack (Emotive.io): LOW — no public embed documentation found; implementation approach is correct but script URL is account-specific
- Architecture patterns: HIGH for GA4; MEDIUM for Stamped.io; LOW for Emotive
- Pitfalls: HIGH — multiple independent sources confirm the `arguments` object GA4 pitfall

**Research date:** 2026-03-10
**Valid until:** 2026-04-10 (GA4 and Stamped.io are stable; Emotive embed URL is fetched from dashboard at implementation time)
