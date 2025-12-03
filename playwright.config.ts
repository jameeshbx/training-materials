import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",            // look for tests inside /tests folder
  timeout: 30000,
  use: {
    headless: false,             // show the browser UI
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: "retain-on-failure",
  },
});
