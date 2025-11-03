import { test, expect } from '@playwright/test';
import { LoginHelper } from '../utils/LoginHelper';
import { BrowserStackHelper } from './BrowserStackHelper';

test.setTimeout(120000);

test.only('Registering a new Patient', async ({ page }) => {
  try {
    await LoginHelper.login(page, 'souravsusari311@gmail.com', 'Test@123Test');

    await page.getByRole('button', { name: 'Navigate to patient list' }).click();
    await expect(page.getByRole('table', { name: 'Patient List Table' })).toBeVisible();

    await page.locator('//*[@id="tour-guide-patient-Step2"]/sl-dropdown/button').click();
    await page.getByRole('menuitem', { name: 'Quick Registration' }).locator('slot').nth(1).click();

    await page.getByRole('textbox', { name: 'First Name *' }).fill('Third');
    await page.getByRole('textbox', { name: 'Last Name * Sex at Birth *' }).fill('playwrightTaet');
    await page.getByRole('textbox', { name: 'Date of Birth *' }).fill('2010-03-06');
    await page.locator('div').filter({ hasText: /^SelectMaleFemaleUnknown$/ }).locator('#lastname').selectOption('Male');
    await page.getByRole('textbox', { name: 'Mobile Phone *' }).fill('(222)222-22225');
    await page.getByRole('textbox', { name: 'Email' }).fill('sksusari@edvak.com');
    await page.getByRole('textbox', { name: 'Address Line 1 *' }).click();
    await page.getByRole('textbox', { name: 'Address Line 1 *' }).fill('450');
    await page.getByRole('textbox', { name: 'Address Line 2' }).click();
    await page.locator('input[type="[object HTMLInputElement]"]').first().click();
    await page.locator('input[type="[object HTMLInputElement]"]').first().fill('new');
    await page.locator('input[type="[object HTMLInputElement]"]').first().click();
    await page.locator('input[type="[object HTMLInputElement]"]').first().click();
    await page.locator('input[type="[object HTMLInputElement]"]').first().click();
    await page.locator('input[type="[object HTMLInputElement]"]').first().fill('new');
    await page.getByText('New Town').click();
    await page.getByLabel('State').selectOption('AA');
    await page.locator('input[type="[object HTMLInputElement]"]').nth(1).click();
    await page.locator('input[type="[object HTMLInputElement]"]').nth(1).fill('10003');
    await page.getByText('10003').click();
    await page.getByRole('textbox', { name: 'Search insurance plan' }).fill('aetna');
    await page.getByRole('heading', { name: 'AETNA PLUS' }).click();
    await page.locator('div').filter({ hasText: /^Group #$/ }).getByRole('textbox').fill('1545454');
    await page.locator('div').filter({ hasText: /^Policy #$/ }).getByRole('textbox').fill('546464');
    await page.getByRole('textbox', { name: 'Notes' }).fill('Test');
    await page.getByRole('button', { name: 'Register Patient' }).click();
    await page.waitForTimeout(5000);

    await BrowserStackHelper.markTestStatus(page, 'passed', 'Patient registered successfully');
  } catch (err: any) {
    await BrowserStackHelper.markTestStatus(page, 'failed', `Test failed: ${err.message}`);
    throw err;
  }
});
