import { test } from "@playwright/test";
import path from "path";

test("authenticate and save session", async ({ page }) => {

    // go to login page
    await page.goto("http://localhost:3000");

    // fill login form
    await page.fill('input[type="email"]', "minnu@gmail.com");
    await page.fill('input[type="password"]', "minnu123");
    await page.click('button:has-text("Login")');

    // wait for dashboard
    await page.waitForURL("**/dashboard", { timeout: 15000 });

    // generate correct path inside tests folder
    const savePath = path.join(__dirname, "auth.json");

    // save authenticated session
    await page.context().storageState({ path: savePath });

    console.log("Session saved to:", savePath);
});

