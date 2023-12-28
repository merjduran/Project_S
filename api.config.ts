import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/api',
  timeout: 50000,
  fullyParallel: true,
  use: {
    baseURL: 'https://sertis-qa.glitch.me',
    trace: 'on-first-retry',
    headless: true
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
