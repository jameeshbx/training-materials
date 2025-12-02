import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    conditions: ["node"],
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],

    // Only run your test files
    include: [
      "tests/**/*.test.ts",
      "tests/**/*.spec.ts"
    ],

    // Prevent running node_modules test files
    exclude: [
      "node_modules/**/*",
      "tests/e2e/**",
      "playwright.config.ts"
    ]
  },
});
