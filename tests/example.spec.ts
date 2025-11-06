import { expect, test } from '@playwright/test';
import { LoginHelper } from '../utils/LoginHelper';
import { BrowserStackHelper } from '../tests/BrowserStackHelper';

test.setTimeout(120000);

test('should create a new encounter and submit to billing', async ({ page }) => {
  try {
    // Login using helper
    await LoginHelper.login(page, 'souravsusari311@gmail.com', 'Sourav@123');

    // --- Your existing test steps here ---
    await page.locator('a[aria-label="Navigate to billing screen"]').click();
    await page.getByRole('button', { name: 'New Charge' }).click();
    await page.locator('type-ahead').getByRole('textbox', { name: 'Search' }).fill('sourav susari');
    await page.getByLabel('Sidebar', { exact: true }).getByText('Sourav Susari').first().click();
    await page.locator('//app-encounter-selection/sl-dropdown').filter({ hasText: 'Select' }).first().click();
    await page.getByRole('button', { name: 'Create New Encounter' }).click();

    await page.locator('ng-select').filter({ hasText: 'Select Provider' }).getByRole('combobox').click();
    await page.getByLabel('Options List').getByText(' Robert WilliamsThree ').click();

    await page.locator('ng-select').filter({ hasText: 'Select Location' }).getByRole('combobox').click();
    await page.getByLabel('Options List').getByText('125TH ST. DENTAL GROUP, PLLC').click();

    await page.locator('ng-select').filter({ hasText: 'Select Visit Type' }).getByRole('combobox').click();
    await page.getByText('Chronic Disease Management ').click();
    await page.locator('app-encounter-selection').getByRole('textbox').fill('2025-10-07');
    await page.getByRole('button', { name: 'Create Encounter' }).click();

    await page.locator('.ng-select-searchable.ng-select.ng-select-single.ng-untouched > .ng-select-container > .ng-value-container').first().click();
    await expect(page.getByText('Encounter#: ')).toBeVisible();

    // Handle loader
    const loader = page.locator('img[src="./assets/images/loader.svg"]');
    if (await loader.isVisible()) {
      await loader.waitFor({ state: 'hidden', timeout: 30000 });
    }

    await page.getByRole('option', { name: 'Self-Pay' }).click();
    await page.locator('app-problem-search-panel').getByRole('textbox', { name: 'Search' }).fill('M25.011');
    await page.locator('app-problem-search-panel').getByRole('textbox', { name: 'Search' }).press('Backspace');
    await page.locator('app-problem-search-panel').getByRole('textbox', { name: 'Search' }).type('1');

    await page.waitForTimeout(30000);

    const problemPanelItem = page.locator('//app-problem-search-panel/div[2]/div[1]');
    await expect(problemPanelItem).toBeEnabled({ timeout: 10000 });

    for (let attempt = 0; attempt < 3; attempt++) {
      await problemPanelItem.click({ force: true });
      await page.waitForTimeout(1000);
      const noDataFound = await page.locator('//*[@id="cdk-drop-list-30"]/tr/td/h6').isVisible();
      if (!noDataFound) break;
    }

    await expect(page.locator('//*[@id="cdk-drop-list-30"]/tr/td/h6')).toBeHidden({ timeout: 5000 });

    await page.getByRole('textbox', { name: 'Search CPT Codes to add to' }).fill('98925');
    // console.log(await page.content() + "Testing");

    const cptRow = page.locator('//ed-drawer-body/div[4]/div[2]/div[1]/div[2]/div[1]');
    await expect(cptRow).toBeVisible();
    await cptRow.click();

    await page.getByRole('spinbutton').nth(1).fill('199.98');
    await page.waitForTimeout(30000);
    await page.getByRole('button', { name: 'Submit to Billing' }).click();

    
   await BrowserStackHelper.markTestStatus(page, 'passed', 'Encounter created successfully');
} catch (err: any) {
  await BrowserStackHelper.markTestStatus(page, 'failed', `Test failed: ${err.message}`);
  throw err;
}
});
