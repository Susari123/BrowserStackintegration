import { Page } from '@playwright/test';

export class BrowserStackHelper {
  static async markTestStatus(page: Page, status: 'passed' | 'failed', reason: string) {
    if (page.isClosed()) {
      console.warn('Page is already closed, cannot mark BrowserStack status.');
      return;
    }
    try {
      await page.evaluate(
        ({ s, r }) =>
          `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"${s}","reason":"${r}"}}`,
        { s: status, r: reason }
      );
    } catch (err) {
      console.warn('Failed to set BrowserStack session status:', err);
    }
  }
}
