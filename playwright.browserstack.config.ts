import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  fullyParallel: false,
  reporter: [['list']],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chrome@latest:Windows 11',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
      },
    },
  ],
});
