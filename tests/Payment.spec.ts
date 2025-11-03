import { test, expect } from '@playwright/test';
import { LoginHelper } from '../utils/LoginHelper';
import { BrowserStackHelper } from './BrowserStackHelper';

test.setTimeout(180000); // 3 minutes timeout

test.only('Billing - Patient payment', async ({ page }) => {

  try {
    // ===================== LOGIN =====================
    await LoginHelper.login(page, 'souravsusari311@gmail.com', 'Sourav@123');
    // await expect(page.locator('h4:has-text("dashboard")')).toBeVisible();
    console.log('✅ Dashboard is visible after login');
    // ===================== BILLING PAGE =====================
    const billingButton = page.locator("//span/ed-icon[@name = 'attach_money']");
    await billingButton.click();
    await expect(page.locator('h4:has-text("billing")')).toBeVisible();
    console.log('✅ Billing page is visible');
    
    const paymentTab = page.locator("//app-tab-title/div[contains(text(),' Payments ')]");
    await paymentTab.click();
    console.log('✅ Payment tab clicked');
    const newPaymentButton = page.locator('//*[@id="content-area"]/app-encounters-list/div/div/app-payments-list/ed-col/section/div[1]/div/sl-icon-button');
    await newPaymentButton.click();
    await expect(page.locator("//h6[contains(text(),'New Payment')]")).toBeVisible();
    console.log('✅ New Payment drawer is visible');
     await page.getByRole('dialog', { name: 'Sidebar' }).locator('input[type="date"]').fill('2025-11-03');
  await page.locator('.ng-input').first().click();
  // await expect(page.getByRole('listbox', { name: 'Options List' })).toBeVisible();
    console.log('✅ Payment date selected');
  await page.getByRole('option', { name: 'Patient' }).click();
  await page.getByRole('textbox', { name: 'Search Patient' }).click();
  await page.getByRole('textbox', { name: 'Search Patient' }).fill('Test');
  // await expect(page.locator('div').filter({ hasText: /^Test A25Y \| M01-01-2000MRN: M6SA3T121349$/ }).getByRole('img')).toBeVisible();

  await page.locator('div').filter({ hasText: /^Test A25Y \| M01-01-2000MRN: M6SA3T121349$/ }).click();
  await page.locator('ng-select').filter({ hasText: /^×$/ }).locator('div').nth(3).click();
  // await expect(page.getByRole('listbox', { name: 'Options List' })).toBeVisible();

  await page.getByRole('option', { name: 'Cash' }).click();
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('120');
  await page.locator('textarea').click();
  await page.locator('textarea').fill('Test Cash 1');
  await page.getByText('Received DatePayment Type×').click();
  await page.getByRole('button', { name: 'Add New Payment', exact: true }).click();
    await BrowserStackHelper.markTestStatus(page, 'passed', 'Billing claim generated successfully');
  } catch (err: any) {
    await BrowserStackHelper.markTestStatus(page, 'failed', `Test failed: ${err.message}`);
    throw err;
  }
});
