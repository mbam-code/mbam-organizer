const { chromium } = require('@playwright/test');

async function resetStorage() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    console.log('LocalStorage and SessionStorage cleared');

    // Reload the page
    await page.reload({ waitUntil: 'networkidle' });
    console.log('Page reloaded');

    // Take a screenshot
    await page.waitForSelector('h1', { timeout: 5000 });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `./screenshots/screenshot-${timestamp}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to: ${screenshotPath}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

resetStorage();
