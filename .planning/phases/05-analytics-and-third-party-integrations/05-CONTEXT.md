# Phase 5: Analytics and Third-Party Integrations — Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire up GA4 purchase/browse tracking, surface real Stamped.io reviews on product pages and a homepage carousel, and replace the non-functional EmotivePopup mock with the real Emotive.io SDK embed. No new marketing capabilities — this phase makes three existing integrations real.

</domain>

<decisions>
## Implementation Decisions

### GA4 — Events to track
- Track all 5 ecommerce events: `view_item`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `purchase`
- Fire `page_view` automatically on every view change in App.tsx (not per-page manually)
- All events use the full GA4 ecommerce item schema: `item_id`, `item_name`, `item_category`, `price`, `quantity`

### GA4 — Configuration
- Measurement ID stored as `VITE_GA4_MEASUREMENT_ID` environment variable
- Same pattern as Turnstile/Stripe keys — never hardcoded in source

### Stamped.io — Where it appears
- Full reviews widget on **ProductPage** — renders below product info/specs section
- **Homepage carousel** of reviews — a Stamped.io reviews carousel widget embedded in the homepage (below existing sections)
- No reviews on category pages (BaitPage, RodPage, etc.)

### Stamped.io — Loading and empty state
- Widget container is hidden until Stamped.io confirms reviews exist
- Zero reviews = section does not render at all (no spinner, no empty state message)
- Re-initialize widget when product changes (handles navigation between products)

### Stamped.io — Configuration
- Store hash: `VITE_STAMPED_STORE_HASH` environment variable
- API key: `VITE_STAMPED_API_KEY` environment variable

### Emotive — Trigger and frequency
- Popup triggers after a **5-second delay** on page load
- Frequency/suppression managed by Emotive's SDK (defer to their built-in logic — do not add custom localStorage suppression)

### Emotive — Widget style
- Use **Emotive's default widget** via SDK embed — no custom CSS overriding their UI
- Remove the current custom-styled EmotivePopup.tsx mock entirely

### Emotive — TCPA consent
- Use standard TCPA boilerplate language:
  > "By subscribing, you agree to receive recurring automated marketing text messages from HeySkipper at the number provided. Msg & data rates may apply. Reply STOP to opt out."

### Claude's Discretion
- Exact GA4 script loading strategy (gtag.js CDN vs npm package)
- Stamped.io script injection approach (CDN tag vs their JS SDK)
- Error handling if GA4 or Stamped.io scripts fail to load
- Where exactly in App.tsx the 5-second Emotive delay is implemented

</decisions>

<specifics>
## Specific Ideas

- Homepage should have a Stamped.io reviews **carousel** (not just a static widget) — this is a separate embed from the per-product reviews widget
- Emotive should use their own default popup design — no effort spent matching HeySkipper brand aesthetic for the popup

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-analytics-and-third-party-integrations*
*Context gathered: 2026-03-10*
