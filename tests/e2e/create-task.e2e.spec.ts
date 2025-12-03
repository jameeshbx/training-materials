import { test, expect } from "@playwright/test";

test("User can login and create a task", async ({ page }) => {
  // 👇 unique task name to avoid duplicates
  const taskName = `E2E Test Task ${Date.now()}`;

  // 1) Open login page
  await page.goto("http://localhost:3000/auth/login");

  // 2) Fill credentials
  await page.getByLabel("Email").fill("john@example.com");
  await page.getByLabel("Password").fill("password123");

  // 3) Click login
  await page.getByRole("button", { name: "Login" }).click();

  // 4) Wait for dashboard
  await page.waitForURL("**/dashboard", { timeout: 15000 });

  // 5) Go to Tasks page
  await page.getByRole("link", { name: "Tasks" }).click();
  await page.waitForURL("**/tasks", { timeout: 15000 });

  // 6) Click "+ New Task"
  await page.getByRole("link", { name: "+ New Task" }).click();
  await page.waitForURL("**/tasks/new", { timeout: 15000 });

  // 7) Fill create-task form
  await page.getByRole("textbox").nth(0).fill(taskName); // Title
  await page.getByRole("textbox").nth(1).fill("Task created during E2E test"); // Description

  // 8) Click "Create Task" button
  await page.getByRole("button", { name: "Create Task" }).click();

  // 9) Wait back on /tasks (list page)
  await page.waitForURL("**/tasks", { timeout: 15000 });

  // 10) Assert the new task is visible
  await expect(
    page.getByRole("heading", { name: taskName }).first()
  ).toBeVisible();
});
