const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should navigate to all main pages', async ({ page }) => {
    // Test Dashboard
    await page.click('a[routerLink="/dashboard"]');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('#dashboardTitle')).toContainText('Business Overview');

    // Test Employees
    await page.click('a[routerLink="/employees"]');
    await expect(page).toHaveURL(/.*employees/);

    // Test Timesheets
    await page.click('a[routerLink="/timesheets"]');
    await expect(page).toHaveURL(/.*timesheets/);

    // Test Inventory
    await page.click('a[routerLink="/inventory"]');
    await expect(page).toHaveURL(/.*inventory/);

    // Test Calendar
    await page.click('a[routerLink="/calendar"]');
    await expect(page).toHaveURL(/.*calendar/);
  });

  test('should display navigation menu', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    const navLinks = nav.locator('a');
    expect(await navLinks.count()).toBeGreaterThan(4);
  });

  test('should highlight active navigation item', async ({ page }) => {
    await page.click('a[routerLink="/employees"]');
    const activeLink = page.locator('a[routerLink="/employees"].active');
    await expect(activeLink).toBeVisible();
  });

  test('should display chatbot widget', async ({ page }) => {
    const chatbot = page.locator('#chatbotContainer');
    await expect(chatbot).toBeVisible();
    
    const chatToggle = page.locator('#chatToggle');
    await expect(chatToggle).toBeVisible();
  });

  test('should open chatbot when clicked', async ({ page }) => {
    await page.click('#chatToggle');
    const chatWindow = page.locator('#chatWindow');
    await expect(chatWindow).toBeVisible();
  });
});