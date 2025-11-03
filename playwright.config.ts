import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: path.resolve(__dirname, 'tests'),
  testMatch: ['**/*.spec.ts'],
  timeout: 120000,

  use: {
    headless: true,                        // run in headless mode
    trace: 'on-first-retry',               // collect trace on first retry

    // 🧩 Add these two lines:
    viewport: null,                        // disable Playwright's default 1280x720
    launchOptions: {
      args: ['--start-maximized'],         // launch browser maximized
    },
  },
});
