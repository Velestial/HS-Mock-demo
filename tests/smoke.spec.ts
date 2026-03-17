import { test, expect, Page } from '@playwright/test';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Navigate to the home page, using domcontentloaded so we don't block on
 * external scripts (Stripe JS, Google Fonts, Turnstile) that are slow in
 * webkit on Windows.
 */
async function gotoHome(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
}

/** On mobile, nav links live inside the hamburger menu — open it first. */
async function mobileNav(page: Page, buttonLabel: string | RegExp) {
  await page.getByRole('button', { name: /open menu/i }).click();
  await page.getByRole('button', { name: buttonLabel }).click();
}

/**
 * Add the flagship rod to cart, then ensure the sidebar is open and showing items.
 *
 * CartContext behaviour (CartContext.tsx line 79):
 *   - Desktop (>= 768px): addToCart calls setIsOpen(true) — sidebar auto-opens.
 *     When the sidebar is open, the navbar cart button is covered by the z-60 backdrop,
 *     so we wait for "Your Gear" text directly.
 *   - Mobile (< 768px): addToCart shows the MobileAddedSuccess toast instead.
 *     The sidebar stays closed — we open it explicitly via the cart icon.
 */
async function addHeroItemToCart(page: Page, isMobile: boolean) {
  await page.getByRole('button', { name: /add to cart/i }).first().click();

  if (isMobile) {
    // Count badge updates even though sidebar stays closed — wait for it,
    // then explicitly open the sidebar.
    await expect(
      page.getByRole('button', { name: /open cart, 1 item/i })
    ).toBeVisible({ timeout: 8000 });
    await page.getByRole('button', { name: /open cart, 1 item/i }).click();
  }
  // Sidebar should now be open (auto on desktop, explicit on mobile)
  await expect(page.getByText('Your Gear')).toBeVisible({ timeout: 8000 });
}

/** Click the CartSidebar checkout button (uniquely identified by SECURE_PAYMENT label). */
async function clickCheckout(page: Page) {
  await page.locator('button').filter({ hasText: 'SECURE_PAYMENT' }).click();
}

// ─── Homepage ────────────────────────────────────────────────────────────────

test('homepage loads with hero and navbar', async ({ page }) => {
  await gotoHome(page);
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByAltText(/9.2 Hybrid Travel Rod/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /add to cart/i }).first()).toBeVisible();
});

test('hero spec bar shows all 4 fields', async ({ page }) => {
  await gotoHome(page);
  await expect(page.getByText('Toray Carbon')).toBeVisible();
  await expect(page.getByText('In Stock')).toBeVisible();
  await expect(page.getByText('5.2 oz / 147g')).toBeVisible();
});

// ─── Navigation — desktop only ───────────────────────────────────────────────

test('FAQ page loads - desktop', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop only — mobile uses hamburger');
  await gotoHome(page);
  await page.getByRole('navigation').getByRole('link', { name: /^faq$/i }).click();
  await expect(page.getByRole('heading', { name: /^faq$/i })).toBeVisible();
});

test('Rods page loads - desktop', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop only — mobile uses hamburger');
  await gotoHome(page);
  await page.getByRole('navigation').getByRole('link', { name: /^rods$/i }).click();
  await expect(page.getByRole('heading', { name: /rod series/i })).toBeVisible();
});

// ─── Navigation — mobile only ─────────────────────────────────────────────────

test('FAQ page loads - mobile', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile only');
  await gotoHome(page);
  await mobileNav(page, /^faq$/i);
  await expect(page.getByRole('heading', { name: /^faq$/i })).toBeVisible();
});

test('Rods page loads - mobile', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile only');
  await gotoHome(page);
  await mobileNav(page, /^rods$/i);
  await expect(page.getByRole('heading', { name: /rod series/i })).toBeVisible();
});

// ─── Cart — add to cart behavior ─────────────────────────────────────────────

test('add to cart auto-opens sidebar on desktop', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop only — mobile shows toast instead');
  await gotoHome(page);
  await page.getByRole('button', { name: /add to cart/i }).first().click();
  // Desktop: CartContext calls setIsOpen(true) directly
  await expect(page.getByText('Your Gear')).toBeVisible({ timeout: 5000 });
});

test('add to cart shows mobile toast on mobile', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile only — desktop auto-opens sidebar instead');
  await gotoHome(page);
  await page.getByRole('button', { name: /add to cart/i }).first().click();
  // Mobile: CartContext shows MobileAddedSuccess toast, sidebar stays closed
  await expect(page.getByText('Added to Cart')).toBeVisible({ timeout: 5000 });
});

// ─── Cart — sidebar interactions ─────────────────────────────────────────────

test('cart sidebar shows item after add', async ({ page, isMobile }) => {
  await gotoHome(page);
  await addHeroItemToCart(page, !!isMobile);
  await expect(page.getByText(/hybrid travel/i).first()).toBeVisible();
});

test('cart count badge appears after adding item', async ({ page }) => {
  await gotoHome(page);
  await page.getByRole('button', { name: /add to cart/i }).first().click();
  await expect(
    page.getByRole('button', { name: /open cart, 1 item/i })
  ).toBeVisible({ timeout: 8000 });
});

test('cart empty state shows featured rod quick-add', async ({ page }) => {
  await gotoHome(page);
  await page.getByRole('button', { name: /^open cart$/i }).click();
  await expect(page.getByText('Nothing here yet.')).toBeVisible();
  await expect(page.getByRole('status').getByText(/9.2/)).toBeVisible();
});

test('remove item from cart', async ({ page, isMobile }) => {
  await gotoHome(page);
  await addHeroItemToCart(page, !!isMobile);
  await page.getByRole('button', { name: /remove.*hybrid travel/i }).click();
  await expect(page.getByText('Nothing here yet.')).toBeVisible();
});

// ─── Checkout ─────────────────────────────────────────────────────────────────

test('checkout page loads after adding item', async ({ page, isMobile }) => {
  await gotoHome(page);
  await addHeroItemToCart(page, !!isMobile);
  await clickCheckout(page);
  await expect(page.getByRole('heading', { name: 'Contact Info' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Shipping Details' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Payment' })).toBeVisible();
});

test('checkout back button returns to home', async ({ page, isMobile }) => {
  await gotoHome(page);
  await addHeroItemToCart(page, !!isMobile);
  await clickCheckout(page);
  await page.getByRole('button', { name: /return to shop/i }).click();
  await expect(page.getByAltText(/9.2 Hybrid Travel Rod/i)).toBeVisible();
});

// ─── Mobile menu ──────────────────────────────────────────────────────────────

test('mobile hamburger opens and closes menu', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile only');
  await gotoHome(page);
  await page.getByRole('button', { name: /open menu/i }).click();
  await expect(page.getByRole('button', { name: /^faq$/i })).toBeVisible();
  await page.getByRole('button', { name: /close menu/i }).click();
  await expect(page.getByRole('button', { name: /^faq$/i })).not.toBeVisible();
});

test('mobile Shop accordion expands sub-categories', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile only');
  await gotoHome(page);
  await page.getByRole('button', { name: /open menu/i }).click();
  // Click the chevron div inside the Shop button (stopPropagation prevents page nav)
  const shopBtn = page.locator('#mobile-menu').locator('button').filter({ hasText: /^shop/i });
  await shopBtn.locator('div').click();
  // Sub-items: Rods, Bundles, Bait, Tackle, E-Books
  await expect(page.locator('#mobile-menu').getByRole('link', { name: /^bundles$/i })).toBeVisible();
  await expect(page.locator('#mobile-menu').getByRole('link', { name: /^bait$/i })).toBeVisible();
});

// ─── Responsive layout ────────────────────────────────────────────────────────

test('mobile checkout shows order total bar', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile only');
  await gotoHome(page);
  await addHeroItemToCart(page, !!isMobile);
  await clickCheckout(page);
  // lg:hidden order bar — visible only on mobile viewports
  await expect(page.getByText(/1 item/i)).toBeVisible();
  await expect(page.getByText(/total \$/i)).toBeVisible();
});
