import { test, expect } from "@playwright/test";

test("User can start timer on a task", async ({ page }) => {
  await page.goto("http://localhost:3000/auth/login");
  await page.getByLabel("Email").fill("john@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });

  await page.getByRole("link", { name: "Tasks" }).click();
  await page.waitForURL("**/tasks", { timeout: 15000 });

  // Pick the first task card
const firstTask = page.locator('[data-testid^="task-card-"]').first();

// Click Start button inside that card
await firstTask.getByRole("button", { name: "Start" }).click();

// Expect Stop button to appear
await expect(firstTask.getByRole("button", { name: "Stop & Save" })).toBeVisible({ timeout: 15000 });

// Expect timer is updating (regex text like 00:00:05)
await expect(firstTask.getByText(/\d{2}:\d{2}:\d{2}/)).toBeVisible();
});
