import { chromium } from '@playwright/test';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });

  // Let animations settle
  await page.waitForTimeout(1500);

  const outPath = path.resolve(process.cwd(), 'homepage.pdf');
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  console.log(`PDF saved → ${outPath}`);
  await browser.close();
})();
