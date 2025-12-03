import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and storage before each test
    await page.context().clearCookies();
    await page.goto('http://localhost:3000/login', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
  });

  test('should display login form', async ({ page }) => {
    // Wait for the form to be visible with a more specific selector
    const form = page.locator('form[class*="space-y-5"]');
    await expect(form).toBeVisible({ timeout: 10000 });
    
    // Check if the form elements are visible using more specific selectors
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'LOGIN', exact: true })).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill in the form with invalid credentials
    await page.locator('input[type="email"]').fill('wrong@example.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    
    // Submit the form
    await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
    
    // Wait for error message with a more specific selector
    const errorMessage = page.locator('.text-red-600');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test('should redirect to dashboard after successful login', async ({ page }) => {
    // Mock the API response for successful login
    await page.route('**/api/auth/callback/credentials', route => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });
    });

    await page.route('**/api/auth/session', route => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: { 
            id: 'test-user-id',
            name: 'Test User',
            email: 'test@example.com',
            role: 'USER' 
          }
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    });

    // Fill in the form with valid credentials
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');
    
    // Submit the form and wait for navigation
    await Promise.all([
      page.waitForURL('**/dashboard'),
      page.getByRole('button', { name: 'LOGIN', exact: true }).click()
    ]);
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Submit the form without filling any fields
    await page.getByRole('button', { name: 'LOGIN', exact: true }).click();
    
    // Check for HTML5 validation messages
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Check for required attribute and validation message
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });
});