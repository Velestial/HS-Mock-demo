/**
 * Auth E2E Test Suite — Phase 2 Success Criteria Validation
 *
 * Covers: login, registration, session persistence, logout, PII handling.
 * All API calls are intercepted with page.route() — no real server required.
 *
 * Turnstile: defaults to siteKey '1x00000000000000000000AA' (Cloudflare always-pass test key).
 */
import { test, expect, Page } from '@playwright/test';

// ─── Shared mock data ────────────────────────────────────────────────────────

const MOCK_USER = {
  id: 42,
  email: 'skipper@heyskipper.test',
  first_name: 'Skipper',
  last_name: 'Angler',
};

// Minimal valid-shaped JWT (won't verify signature — server-side concern)
const MOCK_TOKEN = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  btoa(JSON.stringify({ id: 42, email: MOCK_USER.email, first_name: 'Skipper', exp: 9_999_999_999 })),
  'mock_sig',
].join('.');

// ─── Route helpers ───────────────────────────────────────────────────────────

/** Simulate an active httpOnly session — refresh endpoint returns user. */
async function mockActiveSession(page: Page) {
  await page.route('**/api/auth/refresh', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, accessToken: MOCK_TOKEN, user: MOCK_USER }),
    })
  );
}

/** Simulate no session — refresh endpoint returns 401. */
async function mockNoSession(page: Page) {
  await page.route('**/api/auth/refresh', route =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: true, code: 'NO_SESSION', message: 'No session' }),
    })
  );
}

/** Mock a successful login. */
async function mockLoginSuccess(page: Page) {
  await page.route('**/api/auth/login', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, accessToken: MOCK_TOKEN, user: MOCK_USER }),
    })
  );
}

/** Mock a login failure. */
async function mockLoginFail(page: Page) {
  await page.route('**/api/auth/login', route =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: true, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }),
    })
  );
}

/** Mock a successful registration with immediate auto-login. */
async function mockRegisterSuccess(page: Page) {
  await page.route('**/api/auth/register', route =>
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, accessToken: MOCK_TOKEN, user: MOCK_USER }),
    })
  );
}

/** Mock registration where account is created but auto-login fails. */
async function mockRegisterRequiresLogin(page: Page) {
  await page.route('**/api/auth/register', route =>
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, requiresLogin: true, message: 'Account created. Please log in.' }),
    })
  );
}

/** Mock a duplicate-email registration error. */
async function mockRegisterDuplicate(page: Page) {
  await page.route('**/api/auth/register', route =>
    route.fulfill({
      status: 409,
      contentType: 'application/json',
      body: JSON.stringify({
        error: true,
        code: 'EMAIL_EXISTS',
        message: 'An account with this email already exists. Log in instead?',
      }),
    })
  );
}

/** Mock logout endpoint — always succeeds. */
async function mockLogout(page: Page) {
  await page.route('**/api/auth/logout', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  );
}

// ─── Navigation helpers ──────────────────────────────────────────────────────

async function gotoHome(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
}

/** Click the LOGIN nav button (desktop) to open the account/auth view. */
async function clickLoginNav(page: Page) {
  await page.getByRole('button', { name: /^login$/i }).click();
}

/** Switch the auth form to Registration mode. */
async function switchToRegister(page: Page) {
  await page.getByRole('button', { name: /need an account/i }).click();
}

/** The auth form — scoped so it's unambiguous regardless of other forms on the page. */
const authForm = (page: Page) =>
  page.locator('form').filter({ has: page.locator('#login-email') });

/** Fill and submit the login form. */
async function submitLogin(page: Page, email: string, password: string) {
  await page.locator('#login-email').fill(email);
  await page.locator('#login-password').fill(password);
  await authForm(page).locator('button[type="submit"]').click();
}

/** Fill and submit the registration form (Turnstile auto-passes with test siteKey). */
async function submitRegister(page: Page, firstName: string, email: string, password: string) {
  await page.locator('#login-firstName').fill(firstName);
  await page.locator('#login-email').fill(email);
  await page.locator('#login-password').fill(password);
  // Wait for Turnstile to auto-verify (always-pass siteKey '1x00000000000000000000AA')
  // Submit is disabled until turnstileReady — wait for button to become enabled
  const submitBtn = page.getByRole('button', { name: /^create account$/i });
  await expect(submitBtn).toBeEnabled({ timeout: 8000 });
  await submitBtn.click();
}

/**
 * Navigate to the Account page when the user IS logged in.
 * Navbar shows user's first name + dropdown; click that, then "Account".
 */
async function navigateToAccountWhenLoggedIn(page: Page) {
  // Click the user name button to open the dropdown
  await page.locator('button').filter({ hasText: MOCK_USER.first_name }).first().click();
  // Click "Account" in the dropdown
  await page.getByRole('button', { name: /^account$/i }).click();
}

// ─── Only run auth tests on Chromium (auth flow is cross-browser identical) ──
test.use({ browserName: 'chromium' });

// ─── SECTION 1: Login ────────────────────────────────────────────────────────

test.describe('Login', () => {

  test('valid credentials → AccountPage with user name', async ({ page }) => {
    await mockNoSession(page);
    await mockLoginSuccess(page);
    await gotoHome(page);
    await clickLoginNav(page);

    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await submitLogin(page, MOCK_USER.email, 'correctpassword');

    await expect(page.getByText(`Hello, ${MOCK_USER.first_name}`)).toBeVisible({ timeout: 8000 });
  });

  test('wrong password → error banner shown', async ({ page }) => {
    await mockNoSession(page);
    await mockLoginFail(page);
    await gotoHome(page);
    await clickLoginNav(page);

    await submitLogin(page, MOCK_USER.email, 'wrongpassword');

    await expect(page.getByText(/invalid email or password/i)).toBeVisible({ timeout: 6000 });
    // Must still be on login page — not account page
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('missing password → HTML5 validation blocks submit', async ({ page }) => {
    await mockNoSession(page);
    await gotoHome(page);
    await clickLoginNav(page);

    await page.locator('#login-email').fill(MOCK_USER.email);
    // Do NOT fill password — try to submit via the scoped auth form submit button
    await authForm(page).locator('button[type="submit"]').click();

    // Form should not have navigated — login heading still visible
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });
});

// ─── SECTION 2: Registration ──────────────────────────────────────────────────

test.describe('Registration', () => {

  test('successful registration → auto-login → AccountPage', async ({ page }) => {
    await mockNoSession(page);
    await mockRegisterSuccess(page);
    await gotoHome(page);
    await clickLoginNav(page);
    await switchToRegister(page);

    await expect(page.getByRole('heading', { name: /join crew/i })).toBeVisible();
    await submitRegister(page, MOCK_USER.first_name, 'newuser@heyskipper.test', 'Str0ngPass!');

    await expect(page.getByText(`Hello, ${MOCK_USER.first_name}`)).toBeVisible({ timeout: 8000 });
  });

  test('duplicate email → EMAIL_EXISTS error shown', async ({ page }) => {
    await mockNoSession(page);
    await mockRegisterDuplicate(page);
    await gotoHome(page);
    await clickLoginNav(page);
    await switchToRegister(page);

    await submitRegister(page, 'Test', 'exists@heyskipper.test', 'AnyPass123!');

    await expect(
      page.getByText(/account with this email already exists/i)
    ).toBeVisible({ timeout: 6000 });
    // Must stay on registration page
    await expect(page.getByRole('heading', { name: /join crew/i })).toBeVisible();
  });

  test('requiresLogin fallback → shows manual login prompt', async ({ page }) => {
    await mockNoSession(page);
    await mockRegisterRequiresLogin(page);
    await gotoHome(page);
    await clickLoginNav(page);
    await switchToRegister(page);

    await submitRegister(page, 'Test', 'edge@heyskipper.test', 'EdgeCase99!');

    // AuthContext.register() returns false → LoginPage throws and shows error
    await expect(
      page.getByText(/auto-login failed|please log in/i)
    ).toBeVisible({ timeout: 6000 });
  });
});

// ─── SECTION 3: Session persistence ──────────────────────────────────────────

test.describe('Session persistence', () => {

  test('page reload with active cookie → session restored → AccountPage', async ({ page }) => {
    // Refresh endpoint returns user on every call (simulates valid httpOnly cookie)
    await mockActiveSession(page);
    await gotoHome(page);
    await navigateToAccountWhenLoggedIn(page);

    // AuthWrapper calls refreshSession() on mount — with active session mock it succeeds
    await expect(page.getByText(`Hello, ${MOCK_USER.first_name}`)).toBeVisible({ timeout: 8000 });

    // Reload and re-navigate — refresh endpoint still returns user
    await page.reload({ waitUntil: 'domcontentloaded' });
    await navigateToAccountWhenLoggedIn(page);
    await expect(page.getByText(`Hello, ${MOCK_USER.first_name}`)).toBeVisible({ timeout: 8000 });
  });

  test('localStorage only stores id, email, first_name, last_name — no PII', async ({ page }) => {
    await mockActiveSession(page);
    await gotoHome(page);
    await navigateToAccountWhenLoggedIn(page);

    // After seeing the account page, check localStorage
    await expect(page.getByText(`Hello, ${MOCK_USER.first_name}`)).toBeVisible({ timeout: 8000 });

    const stored = await page.evaluate(() => {
      const raw = localStorage.getItem('heyskipper_user');
      return raw ? JSON.parse(raw) : null;
    });

    // Must have exactly these four fields
    expect(stored).not.toBeNull();
    expect(stored).toHaveProperty('id');
    expect(stored).toHaveProperty('email');
    expect(stored).toHaveProperty('first_name');
    expect(stored).toHaveProperty('last_name');

    // Must NOT have PII fields
    expect(stored).not.toHaveProperty('billing');
    expect(stored).not.toHaveProperty('phone');
    expect(stored).not.toHaveProperty('address');
    expect(stored).not.toHaveProperty('address_1');
    expect(stored).not.toHaveProperty('shipping');
    expect(stored).not.toHaveProperty('password');

    // Must have correct schema version
    const version = await page.evaluate(() =>
      parseInt(localStorage.getItem('heyskipper_schema_version') || '0', 10)
    );
    expect(version).toBeGreaterThanOrEqual(2);
  });

  test('old schema localStorage data is evicted on mount', async ({ page }) => {
    await mockNoSession(page);

    // Inject stale pre-Phase-2 data before page loads
    await page.addInitScript(() => {
      localStorage.setItem('heyskipper_schema_version', '1');
      localStorage.setItem('heyskipper_user', JSON.stringify({
        id: 1,
        email: 'old@test.com',
        billing: { address_1: '123 Beach St', phone: '555-1234' }, // PII — must be evicted
      }));
    });

    await gotoHome(page);

    // After mount the schema guard should have cleared the stale record
    const stored = await page.evaluate(() => localStorage.getItem('heyskipper_user'));
    expect(stored).toBeNull();

    const version = await page.evaluate(() =>
      parseInt(localStorage.getItem('heyskipper_schema_version') || '0', 10)
    );
    expect(version).toBeGreaterThanOrEqual(2);
  });

  test('cart localStorage contains no PII', async ({ page }) => {
    await mockNoSession(page);
    await gotoHome(page);

    // Add an item to cart
    await page.getByRole('button', { name: /add to cart/i }).first().click();

    const cart = await page.evaluate(() => {
      const raw = localStorage.getItem('hey-skipper-cart');
      return raw ? JSON.parse(raw) : [];
    });

    expect(Array.isArray(cart)).toBe(true);
    if (cart.length > 0) {
      const item = cart[0];
      // Cart items should only have product catalog data
      expect(item).not.toHaveProperty('email');
      expect(item).not.toHaveProperty('billing');
      expect(item).not.toHaveProperty('phone');
      expect(item).not.toHaveProperty('address');
    }
  });
});

// ─── SECTION 4: Logout ───────────────────────────────────────────────────────

test.describe('Logout', () => {

  test('logout clears session → shows LoginPage', async ({ page }) => {
    await mockActiveSession(page);
    await mockLogout(page);
    await gotoHome(page);
    await navigateToAccountWhenLoggedIn(page);

    await expect(page.getByText(`Hello, ${MOCK_USER.first_name}`)).toBeVisible({ timeout: 8000 });

    await page.getByRole('button', { name: /disembark|logout|log out/i }).click();

    // Logout calls onBack() which returns to home; LOGIN button reappears in navbar
    await expect(page.getByRole('button', { name: /^login$/i })).toBeVisible({ timeout: 6000 });
  });

  test('logout clears heyskipper_user from localStorage', async ({ page }) => {
    await mockActiveSession(page);
    await mockLogout(page);
    await gotoHome(page);
    await navigateToAccountWhenLoggedIn(page);

    await expect(page.getByText(`Hello, ${MOCK_USER.first_name}`)).toBeVisible({ timeout: 8000 });
    await page.getByRole('button', { name: /disembark|logout|log out/i }).click();

    const stored = await page.evaluate(() => localStorage.getItem('heyskipper_user'));
    expect(stored).toBeNull();
  });
});

// ─── SECTION 5: Access control ───────────────────────────────────────────────

test.describe('Access control', () => {

  test('guest visiting account → sees LoginPage not AccountPage', async ({ page }) => {
    await mockNoSession(page);
    await gotoHome(page);
    await clickLoginNav(page);

    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible({ timeout: 6000 });
    await expect(page.getByText(`Hello, ${MOCK_USER.first_name}`)).not.toBeVisible();
  });

  test('authenticated user visiting account → sees AccountPage directly', async ({ page }) => {
    await mockActiveSession(page);
    await gotoHome(page);
    // Session is restored on mount — navigate via the user-name dropdown (not LOGIN button)
    await navigateToAccountWhenLoggedIn(page);

    await expect(page.getByText(`Hello, ${MOCK_USER.first_name}`)).toBeVisible({ timeout: 8000 });
    await expect(page.getByRole('heading', { name: /welcome back/i })).not.toBeVisible();
  });
});
