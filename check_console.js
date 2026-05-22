const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`BROWSER CONSOLE [${msg.type()}]: ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`BROWSER PAGE ERROR: ${err.message}`);
  });

  try {
    console.log('Navigating to http://localhost:5173/...');
    await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 5000 });
    console.log('Navigation completed. Waiting 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (e) {
    console.error('Failed to load page:', e.message);
  } finally {
    await browser.close();
  }
}

run();
