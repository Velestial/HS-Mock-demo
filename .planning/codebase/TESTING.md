# Testing Patterns

**Analysis Date:** 2026-03-02

## Test Framework

**Runner:**
- Not detected - No test runner configured
- No Jest, Vitest, or other test framework found in `package.json`

**Assertion Library:**
- Not applicable - no testing infrastructure present

**Run Commands:**
- No test scripts in `package.json`
- No test execution available

## Test File Organization

**Location:**
- No test files found in project source
- Test files (.test.ts, .test.tsx, .spec.ts, .spec.tsx) not present in `components/`, `context/`, `services/`, `utils/` directories
- Only node_modules contains test files (from Stripe and other dependencies)

**Structure:**
- No test directory structure established
- No test data/fixtures directory

## Testing Status: NOT IMPLEMENTED

The codebase currently has **zero testing infrastructure**:

- No test runner configured
- No test assertion library
- No test files in source code
- No test configuration files
- No test script in package.json

## Testable Components & Functions

Despite lack of tests, the codebase contains several testable units:

**Utility Functions (`utils/productMapper.ts`):**
- `stripHtml(html: string): string` - HTML tag removal
- `mapWooProductToAppProduct(wpProduct: any): Product` - Product mapping
- `mapCategory(categories: any[]): 'bait' | 'tackle' | 'bundle' | 'ebook' | 'rod' | undefined` - Category detection
- `findLocalProduct(wpName: string): Product | undefined` - Product lookup

**API Functions (`services/api.ts`):**
- `createOrder(orderData: any)` - Order creation
- `createPaymentIntent(amount: number)` - Stripe payment intent
- `loginUser(email: string)` - User authentication
- `fetchCustomerOrders(customerId: number)` - Fetch orders
- `fetchProducts()` - Fetch product list
- `updateCustomer(customerId: number, data: any)` - Update customer

**Context Providers (`context/*.tsx`):**
- `AuthProvider` - User authentication context
- `CartProvider` - Shopping cart management
- `ProductProvider` - Product catalog loading

**Custom Hooks:**
- `useAuth()` - Access auth context (includes validation)
- `useCart()` - Access cart context (includes validation)
- `useProducts()` - Access products context (includes validation)

## Error Handling Patterns (Testable)

All async operations include error handling suitable for testing:

**Pattern from `services/api.ts`:**
```typescript
try {
    const response = await axios.post(`${API_URL}/create-order`, orderData);
    return response.data;
} catch (error) {
    console.error('Error creating order:', error);
    throw error;
}
```

**Pattern from `context/AuthContext.tsx`:**
```typescript
try {
    setUser(JSON.parse(storedUser));
} catch (e) {
    console.error("Failed to parse stored user:", e);
    localStorage.removeItem('heyskipper_user');
}
```

**Pattern from `context/CartContext.tsx`:**
```typescript
try {
    setItems(JSON.parse(savedCart));
} catch (e) {
    console.error('Failed to parse cart', e);
}
```

## Recommended Testing Approach

**Framework:** Vitest (aligns with Vite)

**Structure:** Co-located tests
```
components/
├── Hero.tsx
├── Hero.test.tsx
├── CartSidebar.tsx
├── CartSidebar.test.tsx
...
services/
├── api.ts
├── api.test.ts
utils/
├── productMapper.ts
├── productMapper.test.ts
```

**Priority Testing Areas:**
1. **Utility functions** - highest ROI, pure functions, easy to test
   - `stripHtml()` - HTML handling
   - `mapWooProductToAppProduct()` - data transformation
   - `mapCategory()` - category detection logic

2. **Context hooks** - critical for app behavior
   - `useAuth()` validation
   - `useCart()` validation
   - Context provider initialization

3. **API service layer** - integration points
   - Axios call structure
   - Error handling and retry logic
   - Response transformation

4. **Component logic** - user interaction
   - Cart operations (add, remove, update quantity)
   - Form submission and validation
   - Conditional rendering based on state

## Current Code Quality Indicators

**Strengths for Testing:**
- Type safety with TypeScript reduces runtime errors
- Clear separation of concerns (contexts, utilities, components)
- Async/await patterns consistent across services
- Error handling present in critical paths

**Weaknesses:**
- Use of `any` type in API responses (e.g., `orderData: any`)
- Generic error handling with `console.error()`
- No input validation in utility functions
- localStorage parsing without defensive coding

## Development Recommendations

1. **Add Vitest:** Zero-config test runner for Vite
   ```bash
   npm install -D vitest @vitest/ui
   ```

2. **Add test script to package.json:**
   ```json
   "scripts": {
     "test": "vitest",
     "test:ui": "vitest --ui",
     "test:coverage": "vitest --coverage"
   }
   ```

3. **Start with utility tests:**
   - Easiest to write
   - Highest value per effort
   - Pure functions with clear inputs/outputs

4. **Add React Testing Library for components:**
   - Test user interactions, not implementation
   - `npm install -D @testing-library/react @testing-library/user-event`

---

*Testing analysis: 2026-03-02*
