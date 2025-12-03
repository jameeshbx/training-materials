import { test, expect } from "@playwright/test";

test("User can create a task", async ({ page }) => {

  // Generate unique task title
  const uniqueTask = `Playwright Task ${Date.now()}`;

  // 1️⃣ Login
  await page.goto("http://localhost:3000/login");
  await page.fill('input[name="email"]', "tester@gmail.com");
  await page.fill('input[name="password"]', "12345");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/dashboard/);

  // 2️⃣ Navigate to Tasks
  await page.getByRole("link", { name: /tasks/i }).click();

  // 3️⃣ Create Task
  await page.getByRole("button", { name: /add new task/i }).click();
  await page.getByPlaceholder(/enter task title/i).fill(uniqueTask);
  await page.getByPlaceholder(/describe your task/i).fill("Automated Description");

  const date = new Date();
  date.setDate(date.getDate() + 2);
  await page.locator("#dueDate").fill(date.toISOString().split("T")[0]);

  await page.getByRole("button", { name: /create task/i }).click();

  // Wait backend response
  await page.waitForResponse((res) => res.url().includes("/task") && res.status() === 201);

  await page.waitForTimeout(2000);

  // Reload UI and show all
  await page.reload();
  await page.getByRole("button", { name: /show all/i }).click();

  // Scroll bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // 🟢 Final Assertion
  await expect(page.getByText(uniqueTask)).toBeVisible({ timeout: 15000 });
});
