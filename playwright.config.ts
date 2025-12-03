import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/__tests__/e2e',
  timeout: 60 * 1000, // Increased timeout
  fullyParallel: false, // Run tests in sequence
  retries: 1, // Retry failed tests once
  workers: 1, // Run tests one at a time
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000', // Add base URL
    headless: false, // Show browser
    trace: 'on-first-retry', // Capture trace on first retry
    screenshot: 'only-on-failure', // Take screenshots on failure
    viewport: { width: 1280, height: 720 }, // Set viewport size
  },

  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 5 * 60 * 1000, // 5 minutes timeout
    stdout: 'pipe',
    stderr: 'pipe',
  },
});