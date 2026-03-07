# Deferred Items — Phase 02 Auth and Security

## Pre-existing TypeScript Errors (out of scope for 02-02)

Discovered during `npx tsc --noEmit` in plan 02-02. These errors existed before plan 02-02 began and are unrelated to auth changes.

### `types/index.ts` — Product type missing `subCategory`
- `data/products.ts` adds `subCategory` field to Product objects but the `Product` type in `types/index.ts` does not declare it
- `components/ShopPage.tsx` and `components/Navbar.tsx` import `Product` from `../data/products` but it is not exported from there (only from `types/index.ts`)
- **Fix needed:** Add `subCategory?: string` to the `Product` type in `types/index.ts`, or export `Product` type re-export from `data/products.ts`
- **Files affected:** `types/index.ts`, `data/products.ts`, `components/ShopPage.tsx`, `components/Navbar.tsx`
- **Suggested phase:** Phase 5 or Phase 6 (product display work)
