const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config({ path: '.env.test' });

module.exports = defineConfig({
  testDir: './tests/specs',
  timeout: parseInt(process.env.TIMEOUT) || 30000,
  expect: {
    timeout: parseInt(process.env.EXPECT_TIMEOUT) || 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4201',
    trace: 'on-first-retry',
    screenshot: process.env.SCREENSHOT_MODE || 'only-on-failure',
    video: process.env.VIDEO_MODE || 'retain-on-failure',
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
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm start',
    url: process.env.BASE_URL || 'http://localhost:4201',
    reuseExistingServer: !process.env.CI,
  },
});