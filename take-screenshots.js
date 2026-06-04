const { chromium } = require('playwright');
const fs = require('fs');

if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'screenshots/hero.png', fullPage: false });
  console.log('✓ Hero');

  const sections = ['services', 'about', 'portfolio', 'contact'];
  for (const id of sections) {
    await page.evaluate((sId) => {
      const el = document.getElementById(sId);
      if (el) el.scrollIntoView({ behavior: 'instant' });
    }, id);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `screenshots/${id}.png`, fullPage: false });
    console.log(`✓ ${id}`);
  }

  await browser.close();
  if (errors.length) console.log('Console errors:', errors);
  else console.log('No console errors.');
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
