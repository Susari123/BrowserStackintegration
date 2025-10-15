import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: path.resolve(__dirname, 'tests'),
  testMatch: ['**/*.spec.ts'],
  timeout: 120000,

  use: {
    headless: true,
    trace: 'on-first-retry',
  },
});
