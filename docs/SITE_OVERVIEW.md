# Hey Skipper Mock — Site Overview

What this repo is, how it's built, and the visual style it uses. Live demo: https://hs-mock-demo.vercel.app/

Screenshots are in [`docs/screenshots/`](./screenshots). They were taken from a local build of this repo (`npx vite`) at 1440×900 desktop and 390×844 mobile. **Note:** product photos hosted on `heyskipperfishing.com` / `sandbox.heyskipperfishing.com` were blocked in the capture environment, so those images show up as blank grey boxes. Local assets (hero video, rod diagram, category images, Fish On photo) render as they do live. Regenerate with `scripts/screenshots.ts` (see the bottom of this doc).

---

## 1. TL;DR

- **What it is:** a headless storefront mockup for **Hey Skipper Fishing** (travel fishing rods, saltwater bait, tackle, bundles, e-books). It began as a Google AI Studio app and was then built out by hand.
- **Stack:** React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + Framer Motion + lucide-react icons. A small Express 5 server proxies WooCommerce (catalog/orders/customers) and Stripe (payments).
- **Style:** yes, it's **brutalist**. More precisely it's *Swiss / technical brutalism*, sometimes called "spec-sheet" or "industrial minimal". It runs monochrome black on white, every section is boxed in 1px black hairlines, nothing has rounded corners or soft shadows, the headlines are huge, tight and uppercase, and labels are monospace in a `SYSTEM_LABEL` style. The repo's own `metadata.json` calls it *"a high-end, minimalist technical fishing gear interface featuring a monochromatic aesthetic and engineered motion design."*

---

## 2. Visual style / design system

### 2.1 How to describe it
| Trait | How it shows up in this site |
|---|---|
| **Visible grid** | Every section is `border-b border-black`. Columns split with `border-r border-black` or `divide-x divide-black`. The whole site sits in a `max-w-[1920px]` frame with `border-x border-black`, so it reads like a spec sheet or blueprint. |
| **No rounding** | Zero `rounded-*` on cards, buttons or inputs. Even the scrollbar thumb is `border-radius: 0`. The only `rounded-full` uses (13) are tiny dots and badges. |
| **No soft UI** | Almost no shadows. Depth comes from borders and black/white inversion instead of elevation. |
| **Monochrome + one accent** | Black `#000`, white, the Tailwind `neutral-*` greys, and one deep teal **`#2C5F5F`** (hover `#1f4444`) for the main "Add to Cart" CTA and the in-stock dot. Red `#dc2626` appears only for errors and sale states. |
| **Mega type** | Headlines use `font-black uppercase tracking-tighter leading-[0.9]`, from `text-4xl` up to `text-8xl` / `text-[9rem]` ("FISH ON."). |
| **Mono "system" labels** | Small text is `font-mono text-[10px]/text-xs uppercase tracking-widest text-neutral-400/500`. Copy is written like machine output: `TOP_SELLER`, `NEW_STOCK`, `VERIFIED_PURCHASE_DATA`, `SECURE_PAYMENT`, `/// MISSION_READY /// ANY_COAST_ANYWHERE`, "Transmission Received". |
| **Spec-sheet data rows** | The product hero opens with a 4-column `MODEL / WEIGHT / MATERIAL / STATUS` data strip. Labels are mono grey and values are bold uppercase. |
| **Grayscale photography** | Images are `grayscale contrast-110` and go to color on hover (`group-hover:grayscale-0`). They sit under black overlays (`bg-black/40`, `bg-black/55`). Product shots use `mix-blend-multiply` on `bg-neutral-100`. |
| **Inverted hover states** | Links flip to `hover:bg-black hover:text-white`. Text selection is `selection:bg-black selection:text-white`. |
| **Motion** | Framer Motion handles fade/slide-in on scroll (`whileInView`, `viewport={{ once: true }}`, staggered `delay: index * 0.08`) and `ease: 'circOut'` entrances. Buttons shrink on hover (`whileHover={{ scale: 0.98 }}`, `whileTap={{ scale: 0.95 }}`). A CSS marquee runs in the footer, and the cart drawer uses a spring slide (`stiffness: 300, damping: 30`). `prefers-reduced-motion` is respected globally. |

### 2.2 Typography
Loaded from Google Fonts in `index.html`:
- **Space Grotesk** (400/500/600/700) is the body and headline face. Headlines use Tailwind `font-black` (900), which the browser synthesizes from the 700 weight.
- **JetBrains Mono** (400/500/700) is used for labels, prices, specs and metadata. It's wired as Tailwind's `font-mono` in `index.css` via `@theme { --font-mono: ... }`.

Usage counts across `components/`: `font-mono` ×235, `font-bold` ×144, `font-black` ×97, `font-medium` ×14.

### 2.3 Color tokens (effective)
| Role | Value |
|---|---|
| Page background | `#f0f0f0` (outside the frame), `#fff` (inside) |
| Ink / borders / primary buttons | `#000000` |
| Secondary text | `neutral-400` / `neutral-500` / `neutral-600` |
| Panels | `neutral-50` / `neutral-100` |
| Accent CTA | `#2C5F5F`, hover `#1f4444` |
| Error / sale | `#dc2626` |
| Dark sections | `bg-black text-white` with `white/10` dividers and `white/40–70` text |

No custom Tailwind palette is defined. Everything uses Tailwind defaults plus the few hex values above, written inline as arbitrary values (`bg-[#2C5F5F]`).

### 2.4 Recurring component patterns
- **Section header bar:** a full-width strip with `border-b border-black p-4 flex justify-between`. A mono label sits on the left ("Shop by Category") and a mono counter or link on the right ("04 Departments", "View All →").
- **Tag chip:** `font-mono text-[10px] bg-white text-black px-2 py-1 uppercase` on photos, or `bg-black text-white` on product cards.
- **Primary button:** a square black block with `bg-black text-white px-4..12 py-2..6 font-bold uppercase tracking-widest`, often with `ArrowRight` nudged on hover (`group-hover:translate-x-1`).
- **Icon box:** `w-10 h-10 border border-black flex items-center justify-center` holding a lucide icon at `strokeWidth={1.5}`.
- **Inputs:** borderless or underline-only (`border-b border-black`), with mono uppercase placeholders ("ENTER EMAIL").
- **Cards:** grid cells divided by borders rather than floating cards. The image sits on top with `border-b`, info below, and price in mono `tabular-nums`.

---

## 3. Page map (what's on the site)

There is **no URL router**. `App.tsx` holds a `view` state string and swaps components. Every non-home page is `React.lazy()`-loaded inside `<Suspense>` + `<ErrorBoundary>`. A `previousView` state powers "Back" from product pages.

| View | Component | Screenshot |
|---|---|---|
| `home` | sections below | `01`, `02`, `03-*`, `18`, `19` |
| `shop` | `components/pages/ShopPage.tsx` | `06-shop.png` |
| `rods` | `RodPage.tsx` | `07-rods.png` |
| `faq` | `FAQPage.tsx` | `08-faq.png` |
| `final-chance` | `FinalChancePage.tsx` (clearance) | `09-final-chance.png` |
| `travel-rod` | `TravelRodPage.tsx` (landing page) | `10-landing-travel-rod.png` |
| `salted-bait` | `SaltedBaitPage.tsx` (landing page) | `11-landing-salted-bait.png` |
| `bundles` / `bait` / `tackle` / `ebooks` | category pages | `12`–`15` |
| `product` | `ProductPage.tsx` (+ `Lightbox`) | `16-product-detail.png` |
| `checkout` | `CheckoutPage` → `CheckoutFormStep` / `CheckoutSuccessStep`, wrapped in Stripe `<Elements>` | not captured (needs Stripe key) |
| `account` | `AuthWrapper` → `LoginPage` / `AccountPage` | — |
| `privacy` / `terms` / `warranty` | legal pages | — |

Global chrome: the `Navbar` (black utility bar, then the logo/nav row with a **Shop mega menu**, socials, login, cart; see `05-nav-mega-menu.png` and `20-mobile-menu.png`), `CartSidebar` (slide-in drawer "YOUR GEAR [n]", `17-cart-sidebar.png`), `MobileAddedSuccess` toast, `ScrollToTop`, and `Footer` (mono marquee plus a 4-column bordered grid, `04-footer.png`).

### Homepage sections (in order, from `App.tsx`)
1. **VideoHero:** full-screen autoplay `.webm` under `bg-black/55`, with an inverted logo, "BEACH FISHING, BUILT DIFFERENT" in `text-8xl font-black`, and a white square "Shop All" button with an animated scroll indicator.
2. **TrustBar:** a 5-cell strip divided with `divide-x` (Free Shipping $99+, Lifetime Warranty, 1,000+ Anglers, YouTube, Family Owned).
3. **Hero:** the featured 9'2" Hybrid Travel Rod. It has the spec data strip, the rod breakdown diagram, a "THE 9'2" TRAVEL ROD" block and the teal "Add to Cart — $299" button.
4. **CategoryGrid:** 4 grayscale photo tiles (Rods / Bait / Bundles / Tackle) with tag chips that go to color on hover.
5. **BestSellers:** 4 product cards (horizontal scroll on mobile, grid on desktop).
6. **WhyHeySkipper:** a split layout with a grayscale image on one side and 3 icon-box callouts on the other.
7. **YouTubeSection:** an inverted black block, "WATCH US FISH".
8. **Reviews:** "FIELD REPORTS", a 4.9 score and 3 testimonial cells.
9. **StampedCarousel:** Stamped.io reviews widget (only renders when Stamped env keys are set).
10. **FishOnCTA:** a grayscale background with a giant "FISH ON." and an email capture form.

---

## 4. Architecture

```
index.html          Google Fonts, base CSS, #root
main.tsx            ReactDOM root → <App/>
App.tsx             view-state "router", providers, homepage composition, GA4/Stamped/Emotive init
index.css           @import "tailwindcss"; @theme font-mono; reduced-motion; focus ring; marquee keyframes
components/
  layout/           Navbar (mega menu, mobile drawer, account dropdown), Footer
  sections/         homepage blocks (VideoHero, TrustBar, Hero, CategoryGrid, BestSellers, ...)
                    + unused/alt blocks: BentoGrid, Gallery, ProductDescription
  pages/            lazy-loaded views (Shop, Rods, Product, Checkout, landing pages, legal...)
  widgets/          CartSidebar, Lightbox, MobileAddedSuccess, ScrollToTop
  ui/               BentoCell, ErrorBoundary
context/            ProductContext, CartContext (localStorage "hey-skipper-cart"), AuthContext
services/api.ts     axios client → /api (products, orders, customers, payment intent, auth)
hooks/              useCheckoutSubmit (order + Stripe confirm flow)
data/products.ts    local product catalog (names, specs, copy, image URLs) used as source of truth/fallback
utils/              productMapper (Woo → Product), analytics (GA4), stamped (reviews SDK)
server/             Express 5 API (see below)
public/, assets/, img/   logo, rod photos, e-book covers, hero video (img/output_videohdrec.webm), Fishon.jpg
tests/              Playwright smoke + auth specs
```

### 4.1 Frontend data flow
- `ProductContext` starts with the **local catalog** (`data/products.ts`). On mount it calls `GET /api/products` and only **overrides images** for products whose names match. Copy, specs and prices stay local. The site therefore works with no backend at all, which is how the Vercel demo runs.
- `CartContext` keeps cart state in `localStorage`, fires GA4 `add_to_cart`, and opens the drawer or mobile toast.
- `AuthContext` does JWT login against `/api/auth/*`.
- Checkout uses Stripe Elements plus `useCheckoutSubmit`. It creates a Woo order via `/api/create-order`, gets a PaymentIntent from `/api/create-payment-intent`, confirms with Stripe, then calls `/api/update-order`.
- Third-party scripts: GA4 (`utils/analytics.ts`), Stamped.io reviews, Cloudflare Turnstile (`@marsidev/react-turnstile`), and an Emotive SMS popup iframe injected after 5s (skipped on checkout). Each one is gated on `VITE_*` env vars.

### 4.2 Backend (`server/`)
- `index.cjs` is an Express 5 app with a startup env guard (`WC_URL`, `WC_CONSUMER_KEY/SECRET`, `STRIPE_SECRET_KEY`, `FRONTEND_URL`, `NODE_ENV`, `JWT_SECRET`), helmet CSP, a CORS allowlist, morgan logging, a 10kb JSON limit and cookie-parser. It mounts routes under `/api`, serves `dist/`, and falls back to `index.html` for SPA routes.
- Routes: `health`, `products` (Woo catalog, `per_page: 100`), `orders`, `customers`, `payments` (Stripe), `auth` (JWT + httpOnly refresh cookie). Middleware: `errorHandler` (normalized `{error, code, message}`) and `requireAuth`.
- `woocommerce.cjs` creates a shared `@woocommerce/woocommerce-rest-api` client.

### 4.3 Build & deploy
- `npm run dev` runs Vite (5173) and the Express server (3000) together through `concurrently`. Vite proxies `/api` to `:3000`. Env vars load via `dotenvx` from `.env.local` and `server/.env`.
- `vite.config.ts` uses the Tailwind v4 Vite plugin and React, an `@` alias to the repo root, and manual chunks (`vendor-react`, `vendor-ui`, `vendor-maps`, `vendor-stripe`).
- Deploy targets in the repo: **Vercel** (the static demo), **Railway** (`railway.json`: build with vite, start `node server/index.cjs`, healthcheck `/api/health`), and **PM2** on a VPS (`ecosystem.config.js`, staging and production).
- Tests: Playwright (`tests/smoke.spec.ts`, `tests/auth.spec.ts`, `playwright.config.ts`).

### 4.4 Dependencies
Runtime: `react`/`react-dom` 19, `framer-motion` 12, `lucide-react`, `axios`, `@stripe/stripe-js` + `@stripe/react-stripe-js`, `@marsidev/react-turnstile`, `leaflet` + `react-leaflet` (maps), and server-side `express` 5, `helmet`, `cors`, `cookie-parser`, `morgan`, `express-rate-limit`, `jsonwebtoken`, `stripe`, `@woocommerce/woocommerce-rest-api`.
Dev: `vite` 6, `tailwindcss` 4 + `@tailwindcss/vite`, `typescript` 5.8, `@playwright/test`, `concurrently`, `nodemon`, `@dotenvx/dotenvx`.

---

## 5. Reproducing the look elsewhere (cheat sheet)

```html
<!-- fonts -->
Space Grotesk 400–700 (body/headlines), JetBrains Mono 400–700 (labels)

<!-- frame -->
<div class="max-w-[1920px] mx-auto border-x border-black bg-white">

<!-- section header -->
<div class="border-b border-black p-4 flex justify-between items-center">
  <span class="font-mono text-xs uppercase tracking-widest text-neutral-500">Best Sellers</span>
  <span class="font-mono text-xs uppercase text-neutral-400">04 Departments</span>
</div>

<!-- headline -->
<h2 class="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">The 9'2"<br>Travel Rod</h2>

<!-- spec row cell -->
<div class="p-4 border-r border-black flex flex-col">
  <span class="text-xs font-mono uppercase text-neutral-500">Weight</span>
  <span class="text-sm font-bold uppercase">5.2 oz / 147g</span>
</div>

<!-- buttons -->
<button class="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800">+ Add</button>
<button class="bg-[#2C5F5F] text-white px-12 py-6 text-xl font-bold uppercase tracking-widest hover:bg-[#1f4444]">Add to Cart — $299 →</button>

<!-- photo tile -->
<img class="grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700">
<span class="font-mono text-[10px] bg-white text-black px-2 py-1 uppercase">TOP_SELLER</span>
```

Rules of thumb: square corners, 1px black lines everywhere, uppercase everything, mono for anything data-like, grayscale images, one teal accent only on the money button, and `SNAKE_CASE` system-speak in small labels.

---

## 6. Regenerating screenshots

```bash
npm install
npx vite                     # serves http://localhost:5173 (works without the API server)
npx tsx scripts/screenshots.ts            # or pass a base URL, e.g. https://hs-mock-demo.vercel.app
# set CHROMIUM_PATH=/path/to/chrome if Playwright's bundled browser isn't installed
```

Screenshot index:
| File | What |
|---|---|
| `01-home-above-the-fold.png` | Desktop first screen (video hero + nav) |
| `02-home-full.png` | Full desktop homepage |
| `03-home-section-01..10.png` | Each homepage section cropped individually |
| `04-footer.png` | Footer with marquee |
| `05-nav-mega-menu.png` | Shop mega menu open |
| `06`–`15` | Shop, Rods, FAQ, Final Chance, Travel Rod landing, Salted Bait landing, Bundles, Bait, Tackle, E-Books |
| `16-product-detail.png` | Product detail page |
| `17-cart-sidebar.png` | Cart drawer with an item |
| `18`–`20` | Mobile: above the fold, full homepage, open menu |
