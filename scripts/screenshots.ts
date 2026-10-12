// Captures reference screenshots of the main views into docs/screenshots/.
// Usage: start the dev server (npx vite), then: npx tsx scripts/screenshots.ts [baseUrl]
import { chromium, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const BASE = process.argv[2] ?? 'http://localhost:5173';
const OUT = path.resolve(process.cwd(), 'docs/screenshots');
fs.mkdirSync(OUT, { recursive: true });

const settle = (page: Page, ms = 1500) => page.waitForTimeout(ms);

// Scroll through the page so framer-motion whileInView animations fire before a full-page shot
async function revealAll(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await settle(page, 800);
}

async function shot(page: Page, name: string, fullPage = true) {
  if (fullPage) await revealAll(page);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage });
  console.log(`saved ${name}.png`);
}

async function goHome(page: Page) {
  await page.goto(BASE, { waitUntil: 'networkidle' }).catch(() => {});
  await settle(page);
}

// Navigation is state-based (no router), so views are reached by clicking nav links
async function navTo(page: Page, label: string) {
  await goHome(page);
  await page.locator('nav').getByRole('link', { name: label, exact: true }).first().click();
  await settle(page);
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });

  // Desktop
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await goHome(desktop);
  await shot(desktop, '01-home-above-the-fold', false);
  await shot(desktop, '02-home-full');

  // Individual homepage sections
  const sections = await desktop.locator('main > section, main > div').all();
  for (let i = 0; i < sections.length; i++) {
    await sections[i].scrollIntoViewIfNeeded();
    await settle(desktop, 700);
    await sections[i].screenshot({ path: path.join(OUT, `03-home-section-${String(i + 1).padStart(2, '0')}.png`) });
  }
  await desktop.locator('footer').screenshot({ path: path.join(OUT, '04-footer.png') });
  console.log('saved section shots');

  // Shop mega menu
  await goHome(desktop);
  await desktop.locator('nav').getByRole('link', { name: 'Shop' }).first().hover();
  await settle(desktop, 800);
  await shot(desktop, '05-nav-mega-menu', false);

  await navTo(desktop, 'Shop');
  await shot(desktop, '06-shop');
  await navTo(desktop, 'Rods');
  await shot(desktop, '07-rods');
  await navTo(desktop, 'FAQ');
  await shot(desktop, '08-faq');
  await navTo(desktop, 'Final Chance');
  await shot(desktop, '09-final-chance');

  // Landing pages + bundles/bait from the mega menu
  for (const [label, name] of [['Travel Rods', '10-landing-travel-rod'], ['Salted Bait', '11-landing-salted-bait'], ['Bundles', '12-bundles'], ['Bait', '13-bait'], ['Tackle', '14-tackle'], ['E-Books', '15-ebooks']] as const) {
    await goHome(desktop);
    await desktop.locator('nav').getByRole('link', { name: 'Shop' }).first().hover();
    await settle(desktop, 600);
    await desktop.locator('nav').getByText(label, { exact: true }).first().click();
    await settle(desktop);
    await shot(desktop, name);
  }

  // Product detail page via Best Sellers card
  await goHome(desktop);
  await desktop.getByRole('button', { name: /^View / }).first().click();
  await settle(desktop);
  await shot(desktop, '16-product-detail');

  // Cart sidebar after Add to Cart
  await goHome(desktop);
  await desktop.getByRole('button', { name: /Add .* to cart/ }).first().click();
  await settle(desktop, 1000);
  await desktop.getByRole('button', { name: /cart/i }).first().click().catch(() => {});
  await settle(desktop, 1000);
  await shot(desktop, '17-cart-sidebar', false);

  // Mobile
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await goHome(mobile);
  await shot(mobile, '18-mobile-home-above-the-fold', false);
  await shot(mobile, '19-mobile-home-full');
  await mobile.getByRole('button', { name: /menu/i }).first().click().catch(() => {});
  await settle(mobile, 800);
  await shot(mobile, '20-mobile-menu', false);

  await browser.close();
})();
