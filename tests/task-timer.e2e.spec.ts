import { test, expect } from "@playwright/test";

test("User can create a task, start timer, stop timer, and see logged time", async ({ page }) => {

    // LOGIN
    await page.goto("http://localhost:3000");
    await page.fill('input[type="email"]', "minnu@gmail.com");
    await page.fill('input[type="password"]', "minnu123");
    await page.click('button:has-text("Login")');
    await page.waitForURL(/\/dashboard$/, { timeout: 15000 });

    // GO TO ADD TASK
    // GO TO ADD TASK
    await page.goto("http://localhost:3000/tasks");
    await page.click('a:has-text("+ Add Task")');
    await expect(page).toHaveURL(/\/tasks\/addTask$/);

    // CREATE TASK
    const taskTitle = "Playwright Test Task " + Date.now();
    await page.fill('input[placeholder="Task title"]', taskTitle);
    await page.fill('textarea[placeholder="Description"]', "Created by Playwright");
    const today = new Date().toISOString().split("T")[0];
    await page.fill('input[type="date"]', today);
    await page.click('button:has-text("Add Task")');

    // GO BACK
    await page.goto("http://localhost:3000/tasks");

    // ⭐ SEARCH AND WAIT FOR ELEMENT TO RENDER
    await page.fill('input[placeholder="Search tasks..."]', taskTitle);
    const taskCard = page.locator(`div:has(h2:has-text("${taskTitle}"))`).first();
   

    // START TIMER
    await taskCard.locator('button:has-text("Start Timer")').click();
    await page.waitForTimeout(1500);

    // STOP TIMER
    await taskCard.locator('button:has-text("Stop Timer")').click();
    await expect(taskCard.locator('button:has-text("Start Timer")')).toBeVisible();

    // RELOAD & SEARCH AGAIN
    await page.reload();
    await page.fill('input[placeholder="Search tasks..."]', taskTitle);
    const refreshedCard = page.locator(`div:has(h2:has-text("${taskTitle}"))`).first();
    await expect(refreshedCard).toBeVisible({ timeout: 15000 });
    await expect(refreshedCard.locator("text=Start:")).toBeVisible({ timeout: 15000 });
    await expect(refreshedCard.locator("text=End:")).toBeVisible({ timeout: 15000 });
});


