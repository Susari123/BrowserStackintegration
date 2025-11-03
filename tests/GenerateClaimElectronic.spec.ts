import { test } from '@playwright/test';
import { generateClaimFlow } from '../utils/GenerateClaim';
import { BrowserStackHelper } from './BrowserStackHelper';



test.setTimeout(180000);

test('Billing - Generate Electronic Claim Flow', async ({ page }) => {
  try {
    const oldEncounterNumber = await generateClaimFlow(page);
    console.log(`📌 Encounter Number Returned: ${oldEncounterNumber}`);

    // Step 2: Wait for Billing table to load
    await page.waitForTimeout(2000);

    // Get all encounter rows (each row's encounter number text element)
    const encounterRows = page.locator('//*[@id="tour-guide-billing-Step5"]/td[1]/div/div/p');

    // Count how many rows are present
    const rowCount = await encounterRows.count();
    console.log(`📋 Total Rows Found: ${rowCount}`);

    let found = false;

    for (let i = 0; i < rowCount; i++) {
      const rowElement = encounterRows.nth(i);
      const rowEncounterNumber = (await rowElement.textContent())?.trim();

      console.log(`🔎 Checking Row ${i + 1}: ${rowEncounterNumber}`);

      if (rowEncounterNumber === oldEncounterNumber) {
        console.log(`✅ Match Found in Row ${i + 1}! Clicking the row...`);
        await rowElement.click();
        found = true;
        break;
      }
    }

    if (!found) {
      console.error('❌ No matching encounter number was found in the billing table.');
      console.error(`Expected Encounter#: ${oldEncounterNumber}`);
    }
    await page.waitForTimeout(2000);
    console.log('✅ Billing table row with matching encounter number clicked');

    //here add steps to generate electronic claim
    //here add steps to generate claim
    console.log("⚙️ Generating claim...");
    // await page.locator('').click(); // Click on Generate Claim button
    await page.waitForTimeout(20000); // Wait for some event indicating claim generation
    await page.locator("//sl-button[contains(text(),'Generate Claim')]").click(); // Confirm Generate Claim in modal
    await page.waitForTimeout(30000); // Wait for claim generation to complete


    console.log("✅ Claim successfully generated!");

    await BrowserStackHelper.markTestStatus(page, 'passed', 'Billing claim generated successfully');
  } catch (err: any) {
    await BrowserStackHelper.markTestStatus(page, 'failed', `Test failed: ${err.message}`);
    throw err;
  }
});

