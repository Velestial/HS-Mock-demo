# Architecture Patterns

**Project:** HeySkipper Headless WooCommerce Storefront
**Domain:** Headless React e-commerce storefront (WooCommerce backend, AI-maintained)
**Researched:** 2026-03-02
**Confidence:** HIGH

---

## Recommended Architecture

**Component-Layered Headless Storefront** with four tiers: clean presentation layer of composable page and section components, a context state layer with JWT-aware auth, a typed service layer for all external communication, and an Express proxy server that secures backend credentials.

**Organizing principle:** AI navigability — every file does one job, every directory answers one question, no component requires reading sibling files to understand what it does.

### High-Level System Diagram

```
Browser
  └── React App (Vite build)
        ├── App.tsx            (router + provider tree)
        ├── context/           (state: Auth, Cart, Products)
        ├── components/
        │     ├── pages/       (routable full-page views)
        │     ├── sections/    (reusable page sections / bento blocks)
        │     ├── ui/          (atoms: Button, Badge, ProductCard)
        │     ├── layout/      (Navbar, Footer, CartSidebar)
        │     └── widgets/     (isolated third-party integrations)
        ├── hooks/             (custom hooks: useAuth, useCart, useProducts)
        ├── services/          (api.ts — all external HTTP calls)
        └── utils/             (productMapper, formatters)

Express Proxy Server (Node.js)
  ├── /api/auth/*              (JWT: login, refresh, logout)
  ├── /api/products/*          (WooCommerce product fetch)
  ├── /api/orders/*            (WooCommerce order CRUD)
  ├── /api/customers/*         (WooCommerce customer management)
  └── /api/payments/*          (Stripe payment intents)

External Services
  ├── WooCommerce REST API     (products, orders, customers)
  ├── Stripe                   (payments)
  ├── Stamped.io               (reviews widget)
  ├── Mailchimp                (email signup)
  └── Emotive.io               (SMS opt-in widget)
```

---

## Component Boundaries

### What Talks to What

| Component | Reads From | Writes To | Never Touches |
|-----------|------------|-----------|---------------|
| Page component | useProducts, useCart, useAuth | CartContext (addToCart) | services/api.ts directly |
| Section component | Props only | Parent via callbacks | Context directly |
| UI atom (ProductCard) | Props only | Parent via callbacks | Context, services |
| Context providers | services/api.ts | Own state + localStorage | Other contexts |
| services/api.ts | Env vars, function args | Returns typed responses | React state, DOM |
| Express server | Env vars, request body | WooCommerce/Stripe responses | React, browser |

### Context Provider Responsibilities

**AuthContext**
- Owns: `user` (id, email, name only), `token` (JWT, in-memory), `isAuthenticated`, `isLoading`
- Exposes: `login(email, password)`, `logout()`, `refreshToken()`, `register(email, password)`
- Persists: Minimal user summary (id, email, name) to localStorage. NOT full customer object. NOT JWT token.
- JWT token lives in: React state (in-memory) only; refresh via httpOnly cookie from Express

**CartContext**
- Owns: `items[]`, `isOpen`, derived `total`, `count`
- Exposes: `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`, `openCart()`, `closeCart()`
- Persists: Cart items to localStorage on every change

**ProductContext**
- Owns: `products[]`, `isLoading`, `error`
- Exposes: `getProductById()`, `getProductsByCategory()`, `refetch()`
- Does not persist — fetch on mount, cache in memory for session

### Third-Party Widget Boundary

Widgets are isolated leaf components. They receive only minimum props (product ID, customer email) and never read from or write to app contexts.

```
ProductPage
  ├── ProductGallery        (reads: product images via props)
  ├── ProductDescription    (reads: product via props)
  ├── AddToCartButton       (writes: CartContext.addToCart via callback)
  ├── StampedReviews        (reads: product.sku via props — isolated)
  └── MailchimpSignup       (isolated — no app state access)
```

---

## Data Flow

### JWT Authentication Flow (Target)

```
1. User submits email + password to LoginPage
2. LoginPage → AuthContext.login(email, password)
3. AuthContext → services/api.ts loginUser(email, password)
4. services/api.ts POST /api/auth/login → Express server
5. Express validates via WooCommerce JWT plugin
6. Express signs app JWT (accessToken 15min) + sets httpOnly cookie (refreshToken 7d)
7. Returns: { accessToken, user: { id, email, firstName, lastName } }
8. AuthContext stores: accessToken in memory, user summary in localStorage
9. All api.ts calls attach: Authorization: Bearer <accessToken>
10. On 401: AuthContext.refreshToken() calls POST /api/auth/refresh (sends cookie automatically)
11. Express validates cookie, issues new accessToken
12. On logout: POST /api/auth/logout clears cookie, AuthContext state resets
```

### Landing Page Data Flow (New Pattern)

```
TravelRodPage mounts
→ reads products from useProducts() (filter by category)
→ passes products as props to section components
→ BentoHeroSection, ProductLineupSection, ReviewsSection, CTASection
→ each section is purely props-driven, no context reads
→ AddToCart callback propagates up to page → page calls CartContext.addToCart()
```

---

## Patterns to Follow

### Pattern 1: Page = Container, Section = Display

```typescript
// Page is container
export function TravelRodPage() {
  const { getProductsByCategory } = useProducts();
  const { addToCart } = useCart();
  const rods = getProductsByCategory('travel-rods');
  return (
    <main>
      <RodHeroSection headline="Built for the Journey" />
      <RodProductLineup products={rods} onAddToCart={addToCart} />
      <StampedReviews productSku={rods[0]?.sku} />
    </main>
  );
}

// Section is pure display
function RodProductLineup({ products, onAddToCart }: Props) {
  return (
    <section>
      {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
    </section>
  );
}
```

### Pattern 2: Bento Grid as Layout Primitive

```typescript
<BentoGrid columns={3}>
  <BentoCell span="2"><HeroImage src={product.images[0]} /></BentoCell>
  <BentoCell><ReviewSummary rating={4.8} count={142} /></BentoCell>
</BentoGrid>
```

### Pattern 3: AI-Navigable File Naming

Adding a new product page = 3 steps:
1. Create `pages/NewProductPage.tsx` — container, composes sections
2. Create sections under `sections/` or reuse existing
3. Add route in `App.tsx` — one line

No changes to context, services, or other pages.

### Pattern 4: Typed Service Layer (No `any`)

```typescript
interface LoginRequest { email: string; password: string; }
interface LoginResponse { accessToken: string; user: AuthUser; }
export async function loginUser(req: LoginRequest): Promise<LoginResponse> { ... }
```

### Pattern 5: JWT via Axios Interceptor

```typescript
// services/apiClient.ts
const apiClient = axios.create({ baseURL: '/api', withCredentials: true });
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const newToken = await refreshAccessToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Pattern 6: Error Boundaries Per Page

```typescript
<Route path="/rod" element={
  <ErrorBoundary fallback={<ErrorPage />}>
    <TravelRodPage />
  </ErrorBoundary>
} />
```

### Pattern 7: Lazy Script Loading for Third-Party Widgets

```typescript
// hooks/useExternalScript.ts
export function useExternalScript(src: string) {
  useEffect(() => {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, [src]);
}
```

---

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Contexts reading other contexts | Circular deps, fragile provider order | App.tsx orchestrates cross-context interactions |
| Pages calling services/api.ts directly | Bypasses cache, breaks loading state | All data fetching through context hooks only |
| Files over 200 lines | AI tools miss context; risky edits | Extract sections and hooks; one responsibility per file |
| Third-party scripts in index.html | Loads on every page, blocks render | Lazy load via `useExternalScript` hook on mount |
| JWT in localStorage | Any script (including widgets) can read it | Access token in React state; refresh token in httpOnly cookie |

---

## Target Component Directory Structure

```
components/
  layout/
    Navbar.tsx
    Footer.tsx
    CartSidebar.tsx
    ScrollToTop.tsx
  pages/
    TravelRodPage.tsx           (NEW)
    SaltedBaitPage.tsx          (NEW)
    TacklePage.tsx
    BundlesPage.tsx
    EbooksPage.tsx
    CheckoutPage.tsx
    AccountPage.tsx
    LoginPage.tsx
    OrderTrackingPage.tsx       (NEW)
    FAQPage.tsx
    PrivacyPolicyPage.tsx
    TermsPage.tsx
    RodWarrantyPage.tsx
  sections/
    RodHeroSection.tsx          (NEW)
    RodBentoShowcase.tsx        (NEW)
    BaitHeroSection.tsx         (NEW)
    ProductLineupSection.tsx    (NEW — reusable)
    ReviewsSection.tsx          (NEW)
    EmailSignupSection.tsx      (NEW)
    CTASection.tsx              (NEW)
  ui/
    ProductCard.tsx
    AddToCartButton.tsx
    BentoGrid.tsx
    BentoCell.tsx               (NEW)
    Gallery.tsx
    Lightbox.tsx
    Hero.tsx
    ProductDescription.tsx
    AuthWrapper.tsx
    ErrorBoundary.tsx           (NEW)
  widgets/
    StampedReviews.tsx          (NEW — isolated)
    MailchimpSignup.tsx         (NEW — isolated)
    EmotiveOptIn.tsx            (NEW — isolated)
```

---

## Suggested Build Order

**Layer 1: Foundation (no dependencies)**
1. `types.ts` — Add AuthUser, LoginRequest, LoginResponse, JWTPayload
2. `components/ui/ErrorBoundary.tsx`
3. `components/ui/BentoGrid.tsx` + `BentoCell.tsx`

**Layer 2: Service and Auth Layer**
4. `services/apiClient.ts` — Axios instance with JWT interceptor
5. `server/index.cjs` — Add `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`
6. `context/AuthContext.tsx` — Replace demo auth with JWT flow

**Layer 3: Widget Integrations (isolated)**
7. `hooks/useExternalScript.ts`
8. `components/widgets/StampedReviews.tsx`
9. `components/widgets/MailchimpSignup.tsx`
10. `components/widgets/EmotiveOptIn.tsx`

**Layer 4: Reusable Sections**
11. `components/sections/ProductLineupSection.tsx`
12. `components/sections/ReviewsSection.tsx`
13. `components/sections/EmailSignupSection.tsx`
14. `components/sections/RodHeroSection.tsx`
15. `components/sections/RodBentoShowcase.tsx`
16. `components/sections/BaitHeroSection.tsx`

**Layer 5: Pages**
17. `components/pages/TravelRodPage.tsx`
18. `components/pages/SaltedBaitPage.tsx`
19. `components/pages/OrderTrackingPage.tsx`
20. Refactor `CheckoutPage.tsx` → step components + EmotiveOptIn

**Layer 6: App Wiring**
21. `App.tsx` — New routes, ErrorBoundary wrappers, updated provider tree
22. Performance: `React.lazy()` + `Suspense` on all page imports

---

## JWT Token Storage

| Storage | XSS Safe | Survives Refresh | JS Accessible | Verdict |
|---------|----------|-----------------|---------------|---------|
| localStorage | No | Yes | Yes | Never for JWT |
| Memory (React state) | Yes | No | No | Use for accessToken |
| httpOnly Cookie | Yes | Yes | No | Use for refreshToken |

Access token (15min): React state. Silent refresh on page load via cookie (<100ms).
Refresh token (7d): httpOnly cookie set by Express — never readable by JS.

---

## Express Auth Endpoints (New)

```
POST /api/auth/login
  Body: { email, password }
  Returns: { accessToken, user: AuthUser }
  Sets: httpOnly cookie 'refreshToken'

POST /api/auth/refresh
  Body: none (reads cookie automatically)
  Returns: { accessToken, user: AuthUser }

POST /api/auth/logout
  Returns: { success: true }
  Clears: refreshToken cookie
```

---

## Open Questions

- Does the WooCommerce install have `JWT Authentication for WP-API` plugin installed?
- Should users stay logged in across browser restarts? (Determines refresh token cookie expiry)
- Does Stamped.io account + API key already exist?

---

*Architecture research: 2026-03-02*
