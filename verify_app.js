const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    // Wait for the app to load
    await page.waitForTimeout(1000);
    // Click the second tool card
    const toolCards = await page.$$('.bg-slate-800');
    if (toolCards.length > 1) {
        await toolCards[1].click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'tool_multi_results.png' });
    }
    await browser.close();
})();
