---
status: testing
phase: 05-analytics-and-third-party-integrations
source: [05-01-SUMMARY.md, 05-02-SUMMARY.md, 05-03-SUMMARY.md]
started: 2026-03-10T18:40:00Z
updated: 2026-03-10T18:40:00Z
---

## Current Test

number: 1
name: No custom EmotivePopup UI
expected: |
  The old custom-styled HeySkipper popup (the one with the boat/SMS opt-in UI built in React) no longer appears at all.
  If VITE_EMOTIVE_SCRIPT_URL is set in .env.local, an Emotive iframe loads after ~5 seconds.
  If the env var is NOT set, nothing appears after 5s — no popup, no error, no blank overlay.
awaiting: user response

## Tests

### 1. No custom EmotivePopup UI
expected: The old custom-styled HeySkipper popup (the one with the boat/SMS opt-in UI built in React) no longer appears at all. If VITE_EMOTIVE_SCRIPT_URL is set in .env.local, an Emotive iframe loads after ~5 seconds. If the env var is NOT set, nothing appears after 5s — no popup, no error, no blank overlay.
result: skipped — iframe loads (confirmed in DevTools: "dapp-connector injected into emotivecdn.io"), no X-Frame-Options errors. Popup not visible on localhost — likely no active campaign or domain not whitelisted in Emotive dashboard. Code is correct; revisit in staging/production.

### 2. GA4 script loads (requires VITE_GA4_MEASUREMENT_ID set)
expected: With VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX set in .env.local and the dev server restarted, open DevTools Network tab filtered to "google" — you should see a request to googletagmanager.com on page load. Without the env var set, no request fires (silently no-ops). Skip if you don't have a GA4 property yet.
result: pass — js?id=G-4XMYEB1N2J (307→200), google-analytics_analytics.js 3.7 kB loaded, initiated by analytics.ts:27

### 3. Page view fires on navigation (requires GA4)
expected: With GA4 DebugView open (GA4 Admin -> DebugView), navigating between app views (Home, Shop, FAQ, etc.) triggers page_view events visible in real time in DebugView. Each view shows the correct page title (e.g., "Shop", "FAQ", "Home"). Skip if GA4 isn't configured.
result: skipped — DebugView requires GA Debugger extension setup; deferred to staging/production verification

### 4. Add to cart fires GA4 event (requires GA4)
expected: With GA4 DebugView open, clicking "Add to Cart" on any product fires an add_to_cart event. The event shows item_id, item_name, price, and value in DebugView. Skip if GA4 isn't configured.
result: skipped — deferred to staging/production with GA4 DebugView

### 5. Remove from cart fires GA4 event (requires GA4)
expected: With cart open and an item added, clicking the remove (X) button fires a remove_from_cart event in GA4 DebugView. Skip if GA4 isn't configured.
result: skipped — deferred to staging/production with GA4 DebugView

### 6. Begin checkout fires GA4 event (requires GA4)
expected: With items in cart, navigating to checkout fires a begin_checkout event in GA4 DebugView with all cart items and the correct total value. Skip if GA4 isn't configured.
result: skipped — deferred to staging/production with GA4 DebugView

### 7. Purchase fires after Stripe confirmation (requires GA4 + test checkout)
expected: After completing a Stripe test checkout (card 4242 4242 4242 4242), a purchase event fires in GA4 DebugView with transaction_id, value, shipping, and tax. The event must NOT fire on failed payments — only on the success screen. Skip if not testing payments.
result: skipped — deferred to staging/production with GA4 DebugView

### 8. Stamped reviews widget on product page (requires Stamped credentials)
expected: With VITE_STAMPED_API_KEY and VITE_STAMPED_STORE_HASH set, navigating to a product page that has reviews shows a "Customer Reviews" section below the product info. Products with zero reviews show no reviews section at all — no empty box, no spinner. Skip if Stamped credentials aren't configured.
result: [pending]

### 9. Product navigation updates reviews (requires Stamped)
expected: Navigating from one product page to another (without a full page reload) shows the correct product's reviews each time — the widget re-initializes for the new product. Skip if Stamped credentials aren't configured.
result: [pending]

### 10. Stamped carousel on homepage (requires Stamped)
expected: The homepage shows a "What Anglers Are Saying" carousel section below the existing static Reviews section. This carousel is a Stamped.io widget (requires Stamped credentials to show real content). Skip if Stamped credentials aren't configured.
result: [pending]

### 11. Security headers present (helmet — plan 05-04)
expected: After server restart, responses to any /api/* request include X-Frame-Options, X-Content-Type-Options, and X-DNS-Prefetch-Control headers. Verify in DevTools Network tab -> response headers on any API call.
result: [pending]

### 12. Rate limiting on login (plan 05-04)
expected: Sending more than 10 POST /api/auth/login requests from the same IP within 15 minutes causes subsequent requests to return HTTP 429 with message "Too many attempts. Try again in 15 minutes."
result: [pending]

### 13. Unauthenticated order creation blocked (plan 05-05)
expected: A POST request to /api/create-order without a valid hs_refresh cookie returns HTTP 401 with code UNAUTHENTICATED. Confirm in DevTools or via curl without a session cookie.
result: [pending]

### 14. Unauthenticated customer data blocked (plan 05-05)
expected: A GET request to /api/customer/:id without a valid hs_refresh cookie returns HTTP 401. Authenticated request (after login) returns the customer data normally.
result: [pending]

### 15. Checkout error messages are safe (plan 05-05)
expected: If the backend returns an error containing HTML (e.g., <b>error</b>), the checkout UI displays the plain-text version with tags stripped. Error messages longer than 200 characters are truncated.
result: [pending]

## Summary

total: 15
passed: 0
issues: 0
pending: 15
skipped: 0

## Gaps

[none yet]
