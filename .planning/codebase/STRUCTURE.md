# Directory Structure

**Analysis Date:** 2026-03-02

## Root Layout

```
hey-skipper-mock (1)/
├── .planning/          # GSD planning documents
├── .vscode/            # VS Code config
├── assets/             # Source image assets (gallery photos, rod-breakdown)
├── components/         # React page and UI components
├── context/            # React Context providers (Auth, Cart, Products)
├── data/               # Static product seed data
├── dist/               # Vite build output
├── public/             # Static assets served directly (images, photos)
├── server/             # Express backend
├── services/           # API service layer
├── utils/              # Utility/helper functions
├── App.tsx             # Root React component
├── index.html          # HTML entry point
├── index.tsx           # Legacy entry (superseded by main.tsx)
├── main.tsx            # React DOM entry point
├── index.css           # Global stylesheet
├── types.ts            # Shared TypeScript types
├── vite.config.ts      # Vite build configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies and scripts
├── metadata.json       # App metadata
├── vite-env.d.ts       # Vite environment type declarations
├── .env.local          # Local environment variables (not committed)
├── .env.keys           # Encryption keys (not committed)
├── debug_api.js        # Debug script (not production code)
├── test_mapper.js      # Test/debug script (not production code)
└── test_mapper.ts      # Test/debug script (not production code)
```

## Key Directories

### `components/` — UI Components (25 files)

Page components (full-page views):
- `AccountPage.tsx` — User account, order history
- `BaitPage.tsx` — Bait product listing
- `BundlesPage.tsx` — Bundle product listing
- `CheckoutPage.tsx` — Multi-step checkout flow (670 lines, largest file)
- `EbooksPage.tsx` — Ebook product listing
- `FinalChancePage.tsx` — Upsell/final offer page
- `LoginPage.tsx` — Authentication page
- `ProductPage.tsx` — Generic product detail page
- `RodPage.tsx` — Rod product page
- `TacklePage.tsx` — Tackle product listing

Layout components:
- `Navbar.tsx` — Top navigation bar
- `Footer.tsx` — Site footer
- `ScrollToTop.tsx` — Scroll restoration on route change

Feature components:
- `CartSidebar.tsx` — Slide-out cart drawer
- `Hero.tsx` — Landing page hero section
- `Gallery.tsx` — Photo gallery
- `Lightbox.tsx` — Image lightbox modal
- `BentoGrid.tsx` — Bento-style grid layout
- `ProductDescription.tsx` — Product description renderer
- `Reviews.tsx` — Customer reviews section
- `AuthWrapper.tsx` — Auth-gated route wrapper

Static/legal pages:
- `FAQPage.tsx` — FAQ
- `PrivacyPolicyPage.tsx` — Privacy policy
- `TermsPage.tsx` — Terms of service
- `RodWarrantyPage.tsx` — Rod warranty info

### `context/` — State Management (3 files)

- `AuthContext.tsx` — User authentication state, login/logout, order history
- `CartContext.tsx` — Shopping cart state, add/remove/update items
- `ProductContext.tsx` — Product catalog loading from WooCommerce API

### `services/` — API Layer (1 file)

- `api.ts` — All external API calls: WooCommerce products, orders, customers; Stripe payment intents

### `utils/` — Utilities (2 files)

- `productMapper.ts` — WooCommerce → App product schema transformation, category detection, HTML stripping
- `analytics.ts` — GA4 init and 7 typed ecommerce event tracking functions (single integration point for all analytics)

### `data/` — Static Data (1 file)

- `products.ts` — Local product definitions used as fallback/seed data

### `server/` — Express Backend (1 file)

- `index.cjs` — Node.js Express server: CORS, health check, proxy to WooCommerce/Stripe
- `.env` — Server environment variables
- `.env.example` — Environment variable template
- `.env.keys` — Key storage

### `public/` — Static Assets

Product images served at root URL:
- `rod3.jpg` through `rod9.jpg` — Rod product photos
- `rodV2CASE.jpg`, `RODV2CASE2.jpg` — Rod case photos
- `assets/` — Brand images, bait photos (clam, shrimp, slab, tent)

## Naming Conventions

**Files:**
- React components: `PascalCase.tsx`
- Context files: `PascalCase` + "Context" suffix
- Service files: `camelCase.ts`
- Utility files: `camelCase.ts`
- Server files: `camelCase.cjs` (CommonJS)

**Co-location:** No — components, contexts, services each in dedicated directories (not co-located)

**Test files:** None present

## Key File Locations

| Purpose | Path |
|---------|------|
| App entry | `main.tsx` |
| Root component | `App.tsx` |
| Global styles | `index.css` |
| All types | `types.ts` |
| API service | `services/api.ts` |
| Auth state | `context/AuthContext.tsx` |
| Cart state | `context/CartContext.tsx` |
| Products state | `context/ProductContext.tsx` |
| Product mapping | `utils/productMapper.ts` |
| Static products | `data/products.ts` |
| Backend server | `server/index.cjs` |
| Build config | `vite.config.ts` |

## Notable Observations

- **Two entry points:** Both `index.tsx` and `main.tsx` exist at root — `main.tsx` appears to be the active one
- **Debug scripts:** `debug_api.js`, `test_mapper.js`, `test_mapper.ts` are loose at root (development artifacts)
- **`dist/` committed:** Build output in version control alongside source
- **`metadata.json`:** App metadata file at root (purpose unclear from structure alone)
- **Flat component directory:** All 25 components in single `components/` directory with no subdirectories

---

*Structure analysis: 2026-03-02*
