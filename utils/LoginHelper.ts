import { Page, expect } from '@playwright/test';

export class LoginHelper {
  static async login(page: Page, email: string, password: string) {
    await page.goto('https://darwinapi.edvak.com/auth/login/');
    await page.getByRole('textbox', { name: 'Enter your email' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(email);
    await page.getByRole('textbox', { name: 'Enter your password' }).dblclick();
    await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('https://darwinapi.edvak.com/dashboard');
    await expect(page).toHaveURL('https://darwinapi.edvak.com/dashboard');
  }
}
