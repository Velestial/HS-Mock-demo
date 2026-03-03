# Architecture

**Analysis Date:** 2026-03-02

## Pattern Overview

**Overall:** Layered Client-Server Architecture with State Management via React Context

**Key Characteristics:**
- React 19 frontend with server-side Express backend
- Frontend-focused with minimal backend implementation (health check only)
- Central state management through React Context providers (Auth, Cart, Products)
- Service layer for API communication abstraction
- Component-based UI with reusable page components
- Local storage persistence for cart and auth state

## Layers

**Presentation Layer (Components):**
- Purpose: UI rendering and user interaction
- Location: `components/`
- Contains: Page components (BaitPage, RodPage, CheckoutPage, etc.), Layout components (Navbar, Footer), Feature components (Hero, Gallery, CartSidebar)
- Depends on: Context hooks (useAuth, useCart, useProducts), Services (api.ts), Types, Assets
- Used by: Main App.tsx, consumed by React Router navigation logic

**State Management Layer (Context):**
- Purpose: Centralized application state and logic distribution
- Location: `context/`
- Contains: AuthContext, CartContext, ProductContext
- Depends on: Services layer (for data fetching), localStorage API, types
- Used by: All components that need state access

**Service Layer (API Integration):**
- Purpose: Handle all external communication and data transformation
- Location: `services/api.ts`
- Contains: Axios-based API functions for orders, payments, customers, products
- Depends on: axios library, environment variables (API_URL)
- Used by: Context providers (ProductContext, AuthContext)

**Data Layer:**
- Purpose: Static product definitions and utilities
- Location: `data/products.ts`, `utils/productMapper.ts`
- Contains: Product seed data, transformation utilities
- Depends on: Types, WooCommerce product schema
- Used by: ProductContext, Components for fallback/local data

**Server Layer (Backend):**
- Purpose: API endpoint provision and proxy gateway
- Location: `server/index.cjs`
- Contains: Express app with CORS, health check endpoint
- Depends on: Express, CORS middleware, environment variables
- Used by: Frontend via fetch/axios to `/api` endpoints

## Data Flow

**Product Loading Flow:**

1. App mounts → ProductProvider initializes
2. ProductContext.useEffect triggers fetchProducts() from services/api.ts
3. Services makes GET /api/products request to backend
4. Backend proxies to WooCommerce REST API
5. Response returns to ProductContext
6. mapWooProductToAppProduct utility transforms WC schema to app Product type
7. Products stored in ProductContext state
8. Components consume via useProducts() hook
9. Cart state persisted to localStorage on any change

**Authentication Flow:**

1. User enters email on LoginPage
2. onLogin triggers AuthContext.login(email)
3. Services calls POST /api/login with email
4. Backend authenticates via WooCommerce API
5. Customer object returned and stored in AuthContext
6. User data persisted to localStorage (key: 'heyskipper_user')
7. useAuth hook provides user object to components
8. On mount, AuthContext restores user from localStorage
9. fetchCustomerOrders triggered when user.id changes

**Cart Flow:**

1. User clicks "Add to Cart" on component
2. addToCart called from useCart hook
3. Item added to CartContext state
4. useEffect saves updated items to localStorage (key: 'hey-skipper-cart')
5. CartSidebar subscribes to cart state via useCart
6. On checkout, createOrder called to backend
7. createPaymentIntent initiated for Stripe payment
8. updateOrderStatus syncs final order to WooCommerce

**State Management:**

- LocalStorage is primary persistence layer for Auth and Cart
- ProductContext caches products in memory after fetch
- No central store (Redux/Zustand) - Context API sufficient
- All contexts initialize state from localStorage on app mount

## Key Abstractions

**Context-Based State Containers:**
- Purpose: Encapsulate state logic and provide hooks for consumption
- Examples: `context/AuthContext.tsx`, `context/CartContext.tsx`, `context/ProductContext.tsx`
- Pattern: React Context + Provider pattern with custom hooks (useAuth, useCart, useProducts)

**API Service Functions:**
- Purpose: Abstract backend communication and centralize request/response handling
- Examples: loginUser(), createOrder(), fetchProducts()
- Pattern: Axios-based async functions with error logging, consistent endpoints
- Location: `services/api.ts`

**Product Transformation:**
- Purpose: Map external WooCommerce schema to internal Product type
- Examples: mapWooProductToAppProduct(), mapCategory()
- Pattern: Utility functions in `utils/productMapper.ts`
- Usage: ProductContext applies mapping during fetch

**Component Page Hierarchy:**
- Purpose: Organize feature pages by business domain
- Examples: BaitPage, RodPage, TacklePage, CheckoutPage, AccountPage
- Pattern: Stateless or minimal-state components consuming context
- Location: `components/` with Page-suffixed naming

## Entry Points

**Client Entry:**
- Location: `main.tsx`
- Triggers: HTML script tag loads module
- Responsibilities: Mounts React app, renders App component, bootstraps all Providers

**App Component:**
- Location: `App.tsx`
- Triggers: Called from main.tsx after DOM render
- Responsibilities: Renders root component, orchestrates context providers (AuthProvider, CartProvider, ProductProvider), health check fetch on mount

**Server Entry:**
- Location: `server/index.cjs`
- Triggers: npm run server command
- Responsibilities: Start Express server, setup middleware (CORS, JSON parsing), register health check endpoint, proxy requests to WooCommerce/Stripe

**Frontend Build:**
- Location: Vite (vite.config.ts)
- Triggers: npm run build/dev/preview
- Responsibilities: Module bundling, React plugin transformation, proxy API requests to http://localhost:3000

## Error Handling

**Strategy:** Graceful degradation with console logging

**Patterns:**
- Services layer: try-catch with error logging to console, rethrow or return fallback (empty array)
- Context layer: Error state (error field in ProductContext), caught exceptions log to console
- Component level: Optional chaining (?.) for undefined access, fallback JSX rendering
- Authentication: Failed login returns false, redirect handled by calling component
- API responses: 404/500 errors logged but don't break app - fallback data used

Examples:
- `loginUser()` in AuthContext catches and logs, returns false on failure
- `fetchCustomerOrders()` returns empty array on error instead of throwing
- `ProductContext` maintains error state and loading state for UI feedback
- `CartContext` silently handles localStorage parse errors

## Cross-Cutting Concerns

**Logging:**
- Approach: console.error() and console.log() throughout codebase
- No centralized logging framework
- Used in services, contexts, and components
- Should be upgraded to proper logging layer in production

**Validation:**
- Approach: TypeScript interfaces for type safety
- Runtime validation minimal - relies on WooCommerce API validation
- Form inputs validated at component level (e.g., CheckoutPage)
- No schema validation library (zod, yup)

**Authentication:**
- Approach: WooCommerce customer lookup by email (magic link style)
- Password ignored in demo - real implementation needs JWT or OAuth
- localStorage stores user JSON between sessions
- No token-based API security - vulnerable to client-side tampering

**CORS:**
- Enabled on server via cors() middleware
- Allows frontend (any origin) to communicate with backend

---

*Architecture analysis: 2026-03-02*
