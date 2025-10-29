const { test, expect } = require('@playwright/test');
const DashboardPage = require('../pages/DashboardPage');

test.describe('Dashboard Page', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToDashboard();
  });

  test('should display dashboard title', async () => {
    const title = await dashboardPage.getPageTitle();
    expect(title).toBe('Business Overview');
  });

  test('should display metric cards', async () => {
    const metricCards = await dashboardPage.getMetricCards();
    expect(await metricCards.count()).toBeGreaterThan(0);
  });

  test('should show employees metric', async () => {
    const employeesCount = await dashboardPage.getEmployeesCount();
    expect(employeesCount).toBeTruthy();
  });

  test('should display recent activity section', async () => {
    const isVisible = await dashboardPage.isRecentActivityVisible();
    expect(isVisible).toBe(true);
  });

  test('should navigate to employees when clicking quick action', async () => {
    await dashboardPage.clickQuickAction('Add Employee');
    await expect(dashboardPage.page).toHaveURL(/.*employees/);
  });
});