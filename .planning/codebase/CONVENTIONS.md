# Coding Conventions

**Analysis Date:** 2026-03-02

## Naming Patterns

**Files:**
- React components: PascalCase (`AccountPage.tsx`, `CartSidebar.tsx`, `CheckoutPage.tsx`)
- Context providers: PascalCase with "Context" suffix (`AuthContext.tsx`, `CartContext.tsx`, `ProductContext.tsx`)
- Utility/service files: camelCase (`productMapper.ts`, `api.ts`)
- Type definitions: Single file `types.ts` for shared interfaces

**Functions:**
- React components: PascalCase (`AccountPage`, `Hero`, `Navbar`)
- React hooks: camelCase with "use" prefix (`useAuth()`, `useCart()`, `useProducts()`)
- Handler functions: "handle" prefix (`handleAddToCart`, `handleLogout`, `handleSubmit`)
- Utility functions: camelCase (`stripHtml`, `mapCategory`, `findLocalProduct`)
- Constants: UPPER_SNAKE_CASE (`US_STATES` in `CheckoutPage.tsx`)

**Variables:**
- State variables: camelCase (`items`, `isOpen`, `formData`, `mapCoords`)
- Computed values: camelCase (`cartTotal`, `cartCount`, `shippingCost`, `finalTotal`)
- Booleans: "is"/"has" prefix (`isOpen`, `hasRod`, `isFinalChance`)

**Types & Interfaces:**
- Type names: PascalCase (`Product`, `User`, `CartItem`, `AuthContextType`)
- Component props: PascalCase with "Props" suffix (`AccountPageProps`, `CheckoutPageProps`)
- Enums: PascalCase with UPPERCASE values (`SectionType.HERO`, `SectionType.SPECS`)

## Code Style

**Formatting:**
- No linter or formatter configured (no `.eslintrc`, `.prettierrc`, `biome.json`)
- Indentation: 2-4 spaces (inconsistent)
- Line length: Varies, some exceed 100 characters
- No strict enforcement

**Linting:**
- No ESLint, Prettier, or Biome detected
- Follows implicit TypeScript/React conventions
- Inconsistencies in spacing between files

## Import Organization

**Order:**
1. React imports (`useState`, `useContext`, etc.)
2. Third-party UI libraries (framer-motion, lucide-react, axios)
3. Custom context imports (`../context/*`)
4. Type imports (`../types`)
5. Service/utility imports (`../services/*`, `../utils/*`)
6. Asset imports (images, CSS)

**Path Aliases:**
- Configured: `@/*` → `./*` in `tsconfig.json`
- Rarely used in practice
- Most imports use relative paths

## Error Handling

**Patterns:**
- Try-catch in async operations (API calls, localStorage parsing)
- `console.error()` logging with descriptive messages
- Silent failures with default returns (`fetchCustomerOrders` returns `[]` on error)
- User-facing errors via state (`setError()`)
- Conditional validation before critical operations

**Example from `services/api.ts`:**
```typescript
export const createOrder = async (orderData: any) => {
    try {
        const response = await axios.post(`${API_URL}/create-order`, orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};
```

**Example from `context/AuthContext.tsx`:**
```typescript
const login = async (email: string, password: string): Promise<boolean> => {
    try {
        const customer = await loginUser(email);
        setUser(newUser);
        localStorage.setItem('heyskipper_user', JSON.stringify(newUser));
        return true;
    } catch (error) {
        console.error("Login Failed:", error);
        return false;
    }
};
```

## Logging

**Framework:** Native `console` object (no dedicated logging library)

**Patterns:**
- `console.log()` for milestones and debugging
- `console.error()` for error conditions
- Used in API services and context providers
- No structured logging or log levels

**Example from `CheckoutPage.tsx`:**
```typescript
console.log("Creating order...", orderData);
console.log("Order created:", order);
console.error("Geocoding failed:", geoError);
```

## Comments

**When to Comment:**
- Non-obvious logic clarifications
- WooCommerce API compatibility notes
- Business rule explanations (shipping, tax rules)
- Workarounds for third-party library issues

**JSDoc/TSDoc:**
- Minimal use (no systematic documentation)
- Inline comments for complex logic
- Some interface field comments

**Example from `CheckoutPage.tsx`:**
```typescript
// Shipping Rule: Rods ($15) overrides Standard ($10). E-books are free ($0).
const hasRod = items.some(item => item.category === 'rod');
const shippingCost = hasRod ? 15.00 : (hasStandardShipping ? 10.00 : 0);

// Tax Rule: All items are tax-free as per new requirement.
const taxAmount = 0;
```

## Function Design

**Size:**
- Components: 50-670 lines (CheckoutPage.tsx is largest at 670 lines)
- Utilities: 5-30 lines typically
- Large components accumulate multiple concerns

**Parameters:**
- Component props as destructured interfaces
- Callbacks as optional/required props (`onBack`, `onProductSelect`)
- Async functions with 1-3 parameters

**Return Values:**
- Components: JSX.Element (implicit with `React.FC`)
- Async: Promises (`Promise<boolean>`, `Promise<void>`)
- Utilities: Transformed data or primitives
- Some functions: null/undefined on error

## Module Design

**Exports:**
- Named exports for utilities/hooks (`export const useAuth`, `export const stripHtml`)
- Default exports for components (`export default Hero`)
- Type/interface exports for sharing definitions
- Context exports: both context and provider

**Barrel Files:**
- No barrel files (index.ts) in `components/` or `context/`
- Direct relative imports per module

**Example from `context/CartContext.tsx`:**
```typescript
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Implementation
};
```

## React-Specific Conventions

**Hooks:**
- Standard: `useState`, `useEffect`, `useContext`
- Custom: `useAuth()`, `useCart()`, `useProducts()`
- Consistent dependency arrays in `useEffect`

**State Management:**
- React Context API for global state (Auth, Cart, Products)
- localStorage for persistence
- Local state for UI toggles

**Props Pattern:**
- Interface-based with "Props" suffix
- `ReactNode` for children typing

**Event Handlers:**
- Arrow functions inline
- "handle" prefix for named handlers
- Properly typed event parameters

---

*Convention analysis: 2026-03-02*
