# Feature Landscape

**Domain:** Specialty fishing e-commerce — product landing pages for premium travel rods and salted bait
**Researched:** 2026-03-02
**Confidence:** MEDIUM-HIGH

---

## Context

HeySkipper is upgrading from generic product listing pages to dedicated **brand story + conversion** landing pages for two hero products:

- **Travel Rod landing page** — premium rods, "fits in carry-on" differentiator, serious angler audience
- **Salted Bait landing page** — "no refrigeration" differentiator, convenience-driven purchase

The existing pages (RodPage.tsx, BaitPage.tsx) already deliver: product images with carousel, inline specs grid, "Add to Cart", a 3-column feature callout strip, and a small editorial section. Landing pages must go significantly further to justify premium prices and tell a brand story.

---

## Table Stakes

Features users expect from a specialty/premium outdoor product page. Missing any causes immediate trust erosion or cart abandonment.

| Feature | Why Expected | Complexity |
|---------|--------------|------------|
| **Hero section with product-in-use imagery** | Anglers need to see the product working in the real world, not on a white background | Low |
| **Clear price visible without scrolling** | Price above the fold reduces bounce on high-ticket items | Low |
| **Prominent, single-purpose CTA** | "Add to Cart" must be the dominant action — not competing with five other buttons | Low |
| **Product image gallery with zoom/lightbox** | Users expect to examine $300 rods closely. Already built (Lightbox.tsx) | Low |
| **Detailed, scannable specs** | Anglers filter by length, action, line rating before anything else | Low |
| **Shipping timeline and cost** | Specialty rods ship in tubes — customers expect to know "when will this arrive?" | Low |
| **Return / warranty policy summary** | Lifetime warranty is a purchase driver. Must be on the page, not buried in footer | Low |
| **Secure checkout badges** | ShieldCheck, Stripe logo, SSL indicator. Reduces checkout hesitation | Low |
| **Mobile-responsive layout** | Fishing gear is heavily mobile-shopped (anglers browsing on the water) | Low |
| **Social proof indicator (review count + rating)** | Star rating near product title reduces hesitation | Med (requires Stamped.io) |
| **In-stock / availability signal** | "Ready to Ship" eliminates fear of ordering something unavailable | Low |

---

## Differentiators

Features that set a specialty fishing brand apart from generic outdoor retailers.

| Feature | Value Proposition | Complexity |
|---------|-------------------|------------|
| **Founder / origin story section** | Specialty buyers purchase from people, not warehouses. "Why did we make this?" is a competitive weapon | Low |
| **"The problem we solved" narrative** | Travel Rods: "Every serious angler has stood at baggage claim watching a rod case get destroyed." Names the pain before presenting the solution | Low |
| **Use-case / scenario storytelling** | "Traveling to Costa Rica for permit? You don't need to rent a rod when yours fits in overhead." Specific scenarios make benefits concrete | Low |
| **Product comparison table (within line)** | Side-by-side comparison (9'2" vs 7'6" vs 11') helps the customer pick the right one without leaving the page | Med |
| **Real user reviews with photos (UGC)** | An angler showing a fish caught on a HeySkipper rod is more persuasive than any copy | High (requires Stamped.io + review volume) |
| **Pro tip / technique content inline** | BaitPage already has a "Cocktail" tip pattern. Inline technique content positions brand as expert, not just vendor | Low |
| **Mailchimp email capture mid-page** | Capture visitors who aren't ready to buy with "Get rigging guides + exclusive offers" | Med |
| **FAQ specific to the product** | "Will airline security flag this?" "Can I use salted bait with artificial lures?" Addresses objections inline | Low |
| **Bento grid layout for features** | Visually distinctive vs standard outdoor retail layouts. Fits the "tactical / serious" brand voice | Med |
| **Emotive.io SMS opt-in at checkout** | "Text me when this ships" is low-friction and builds the SMS list | Med |
| **Order tracking page** | Post-purchase anxiety is high for rod shipments ($300+). Branded tracking reduces support contacts | Med |
| **"You might also need" cross-sell** | Travel Rod page → suggest Bait bundles. Bait page → suggest Tackle/Rig kits | Low |

---

## Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Generic product grid as the landing page** | A grid is a catalog, not a landing page. Existing RodPage IS a grid — tells no story | Build new `TravelRodPage.tsx` and `SaltedBaitPage.tsx` components that lead with narrative |
| **Multiple competing CTAs above the fold** | Splits attention, reduces click-through on primary CTA | One primary CTA per page section |
| **Popup/interstitial email capture on page load** | Anglers are task-oriented. Immediate popup is hostile UX — increases bounce | Inline email capture mid-page or exit-intent only |
| **Chatbot / live chat widget** | Adds page weight, CLS. No one is staffing it | FAQ section handles 80% of questions |
| **Countdown timers / fake scarcity** | The HeySkipper audience researches before buying. Fake scarcity destroys trust | Real scarcity only ("Limited stock" if actually limited) |
| **Star rating widget without real reviews** | Zero-star display hurts trust more than showing nothing | Wait for Stamped.io reviews to accumulate; use text testimonial as bridge |
| **Video autoplay with sound** | Violates browser policies; anglers shop in quiet environments | Autoplay muted + loop for hero video, with play button to unmute |
| **Instagram feed embed** | Third-party Instagram embed APIs are unreliable and slow | Curate 3–4 real catch photos manually as static images |
| **Wishlist / Save for Later** | PROJECT.md explicitly v2 | Defer |
| **Affiliate / referral program** | PROJECT.md explicitly v2 | Defer |

---

## Feature Dependencies

```
Stamped.io reviews
  → Requires Stamped.io account + API key
  → Requires minimum review volume before enabling star display
  → Does NOT block landing page launch (narrative sections are independent)

Mailchimp email capture
  → Requires Mailchimp audience + embedded form or server-side API integration
  → Should appear BEFORE checkout flow (mid-page placement)

Emotive.io SMS capture
  → Belongs at checkout entry point, NOT on landing pages
  → Depends on CheckoutPage.tsx phone field (already exists)

JWT authentication
  → Blocks: Order tracking page (authenticated flow)
  → Does NOT block landing pages

Bento grid layout
  → No infrastructure dependencies — pure CSS/React component work
  → Can be built in parallel with all other features

Order tracking
  → Can be implemented as public lookup (order number + email)
  → Does NOT require JWT to be complete first

Cross-sell section
  → Depends on ProductContext (already works)
  → Manual curation — low risk, no new infrastructure
```

---

## MVP Priority Order

**Build first (highest conversion impact, low complexity):**
1. Hero section with full-bleed product-in-use image + price + CTA
2. "Problem we solved" narrative section (copy-driven, no infra)
3. Specs comparison table / bento grid feature section
4. Warranty / returns / shipping summary card near CTA
5. FAQ accordion (shared component, reuse on both pages)
6. Cross-sell section (manual curation)

**Build second (requires integrations):**
7. Stamped.io review display (after reviews accumulate)
8. Mailchimp inline email capture
9. Emotive.io SMS capture at checkout

**Defer:**
10. UGC photo reviews (requires review volume)
11. Video hero (requires production asset)

---

## Open Questions

- Does HeySkipper have product-in-use photography for a full-bleed hero?
- What is the current Stamped.io review volume per product?
- Does the founder have a photo and story text ready?
- Is the lifetime warranty on Travel Rods confirmed and documented?

---

*Feature research: 2026-03-02*
