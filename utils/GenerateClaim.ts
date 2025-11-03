// tests/helpers/GenerateClaimFlowHelper.ts
import { expect, Page } from '@playwright/test';
import { LoginHelper } from '../utils/LoginHelper';
import { BrowserStackHelper } from '../tests/BrowserStackHelper';

export async function generateClaimFlow(page: Page, extraSteps?: () => Promise<void>) {
  try {
    // ===================== LOGIN =====================
    await LoginHelper.login(page, 'souravsusari311@gmail.com', 'Sourav@123');
    console.log('✅ Dashboard is visible after login');

    // ===================== BILLING PAGE =====================
    const billingButton = page.locator("//span/ed-icon[@name = 'attach_money']");
    await billingButton.click();
    await expect(page.locator('h4:has-text("billing")')).toBeVisible();
    console.log('✅ Billing page is visible');

    // ===================== NEW CHARGE =====================
    const newChargeButton = page.locator("//form//div//sl-button[@id='tour-guide-billing-Step4']");
    await newChargeButton.click();
    await expect(page.locator("//h6[contains(text(),'New Charge')]")).toBeVisible();
    console.log('✅ New Charge drawer is visible');

    // ===================== PATIENT DETAILS =====================
    const patientNameInput = page.locator("//ed-drawer-body/div[1]/div[1]/div/type-ahead/div/input");
    await patientNameInput.fill('Test Sourav');
    await page.waitForTimeout(1000);
    await page.click("//type-ahead/div/div/div");
    console.log('✅ Patient selected');

    // ===================== ENCOUNTER SELECTION =====================
    const encounterDropdown = page.locator("//app-encounter-selection/sl-dropdown");
    await encounterDropdown.click();
    await page.locator("//div/sl-button-group/sl-button[2]").click();
    console.log('✅ New Encounter option selected');

    await page.locator("//div/ng-select[@placeholder='Select Provider']").click();
    await page.getByRole('option', { name: 'Robert WilliamsThree' }).click();
    console.log('✅ Provider selected');

    await page.locator('div').filter({ hasText: /^Select Location$/ }).first().click();
    await page.getByLabel('Options List').getByText('125TH ST. DENTAL GROUP, PLLC').click();
    console.log('✅ Location selected');

    await page.locator('ng-select').filter({ hasText: 'Select Visit Type' }).locator('span').first().click();
    await page.getByRole('option', { name: 'Behavioral Health Consultation' }).click();
    await page.locator('app-encounter-selection').getByRole('textbox').fill('2025-10-24');
    await page.getByRole('button', { name: 'Create Encounter' }).click();
    console.log('✅ Encounter created');

    await page.waitForTimeout(2000);
    const encounterNumberElement = page.locator("//app-encounter-selection/sl-dropdown/div/div");
    await expect(encounterNumberElement).toBeVisible({ timeout: 20000 });
    const encounterText = await encounterNumberElement.textContent();
    const encounterNumber = encounterText?.split('Encounter#: ')[1]?.trim() ?? 'UNKNOWN';
    console.log(`🆔 Encounter Number: ${encounterNumber}`);

    // ===================== PAYER =====================
    const payerSelect = page.locator("//ng-select[@formcontrolname='payer']");
    await payerSelect.click();
    const primaryOption = page.locator("//span[contains(text(), 'Primary')]");
    await primaryOption.waitFor({ state: 'visible', timeout: 5000 });
    await primaryOption.click();
    console.log('✅ Payer selected as Primary');

    // ===================== ICD =====================
    const icdInput = page.locator('//app-problem-search-panel/div/input');
    await icdInput.fill('A00');
    console.log('✅ ICD code entered');

    const skeletonLoader = page.locator('//app-problem-search-panel//ed-skeleton');
    const firstOption = page.locator('//app-problem-search-panel/div[2]/div[1]');

    let suggestionVisible = false;
    for (let i = 0; i < 3; i++) {
      try {
        const isSkeletonVisible = await skeletonLoader.isVisible();
        if (isSkeletonVisible) {
          console.log('⏳ Waiting for ICD loader to disappear...');
          await skeletonLoader.waitFor({ state: 'hidden', timeout: 5000 });
        }
        await firstOption.waitFor({ state: 'visible', timeout: 3000 });
        suggestionVisible = true;
        console.log('✅ ICD suggestion list appeared');
        break;
      } catch {
        console.log(`⚠️  Suggestion not visible yet, retrying (${i + 1}/3)...`);
        await icdInput.click();
        await page.waitForTimeout(500);
      }
    }

    if (suggestionVisible) {
      await firstOption.scrollIntoViewIfNeeded();
      await firstOption.click();
      console.log('✅ ICD code selected');
    } else {
      throw new Error('❌ ICD suggestion list did not appear after retries.');
    }

    // ===================== CPT =====================
    const cptInput = page.locator("//input[@formcontrolname='searchCpt']");
    await cptInput.fill('99213');
    await page.waitForTimeout(500);
    await page.locator('(//div[@class="problemdd_in mb-sm ng-star-inserted"])[1]').click();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    console.log('✅ CPT code selected');

    // ===================== AMOUNT =====================
    const amountInput = page.locator("//tbody//tr//td[8]//input");
    await amountInput.fill('300');
    console.log('✅ Amount entered');

   
    // ===================== SUBMIT =====================
    const submitButton = page.locator("//ed-drawer//ed-drawer-footer//sl-button[1]");
    await submitButton.click();
    console.log('✅ Submit button clicked');
    // Wait for loader to disappear
    await page.waitForSelector("//img[contains(@src, 'loader.svg')]", { state: 'hidden' });
    console.log('✅ Loader disappeared, processing completed');
    // ===================== VALIDATION =====================
    return encounterNumber;
    await BrowserStackHelper.markTestStatus(page, 'passed', 'Billing claim generated successfully');
  } catch (err: any) {
    await BrowserStackHelper.markTestStatus(page, 'failed', `Test failed: ${err.message}`);
    throw err;
  }
}
