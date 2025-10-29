const { test, expect } = require('@playwright/test');
const InventoryPage = require('../pages/InventoryPage');

test.describe('Inventory Page', () => {
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await inventoryPage.navigateToInventory();
  });

  test('should display inventory page', async () => {
    await expect(inventoryPage.page).toHaveURL(/.*inventory/);
  });

  test('should display inventory statistics', async () => {
    const stats = await inventoryPage.getInventoryStats();
    expect(stats.length).toBeGreaterThan(0);
    expect(stats[0].label).toContain('Items');
  });

  test('should add new inventory item', async () => {
    await inventoryPage.clickAddItem();
    await inventoryPage.fillItemForm(
      'Test Item',
      'TEST001',
      'Electronics',
      50,
      10,
      100,
      99.99
    );
    await inventoryPage.saveItem();
    
    const isItemAdded = await inventoryPage.isItemInTable('Test Item');
    expect(isItemAdded).toBe(true);
  });

  test('should open report generation dropdown', async () => {
    await inventoryPage.clickGenerateReport();
    const dropdown = inventoryPage.page.locator('.dropdown-menu');
    await expect(dropdown).toBeVisible();
  });

  test('should generate expense report', async () => {
    await inventoryPage.clickGenerateReport();
    
    // Listen for download
    const downloadPromise = inventoryPage.page.waitForEvent('download');
    await inventoryPage.selectReportType('Monthly');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('inventory-expense-report');
  });
});