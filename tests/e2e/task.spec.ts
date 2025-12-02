import { test, expect } from "@playwright/test";

test("User can create a task", async ({ page }) => {

  // 1️⃣ Login
  await page.goto("http://localhost:3000/login");
  await page.fill('input[name="email"]', "tester@gmail.com");
  await page.fill('input[name="password"]', "12345");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/dashboard/);

  // 2️⃣ Navigate to Tasks Page
  await page.getByRole("link", { name: /tasks/i }).click();
  await page.waitForURL(/tasks/);

  // Count tasks BEFORE creation
  const oldCount = await page.locator('[data-testid="task-card"]').count();

  // 3️⃣ Open Create Task Modal
  await page.getByRole("button", { name: /add new task/i }).click();

  // 4️⃣ Fill Task Form
  await page.getByPlaceholder(/enter task title/i).fill("Playwright Task");
  await page.getByPlaceholder(/describe your task/i).fill("Automated Description");

  // Auto future date
  const date = new Date();
  date.setDate(date.getDate() + 2);
  const formatted = date.toISOString().split("T")[0];
  await page.locator("#dueDate").fill(formatted);

  // Ensure button is enabled
  const createBtn = page.getByRole("button", { name: /create task/i });
  await expect(createBtn).toBeEnabled({ timeout: 5000 });

  // 5️⃣ Click Create Task
  await createBtn.click();

  // 🔥 Wait until backend confirms task was created
  await page.waitForResponse((res) =>
    res.url().includes("/task") && res.status() === 201
  );

  // 🔄 Force UI to refresh to fetch updated list
  await page.reload();

  // Reset filter (important)
  await page.getByRole("button", { name: /show all/i }).click();

  // Wait any loading spinners to disappear
  await page.waitForSelector(".loading-spinner", { state: "detached", timeout: 10000 });

  // 6️⃣ Wait until task count increases
//   await expect(async () => {
//     const newCount = await page.locator('[data-testid="task-card"]').count();
//     expect(newCount).toBeGreaterThan(oldCount);
//   }).toPass({ timeout: 10000 });

//   // 7️⃣ Verify Newly Created Task Exists
//   const newTask = page.locator('[data-testid="task-card"]').filter({ hasText: "Playwright Task" }).first();
//   await expect(newTask).toBeVisible({ timeout: 10000 });

//   // (Optional) Debug log
//   console.log("Tasks found:", await page.locator('[data-testid="task-card"]').allInnerTexts());

});
