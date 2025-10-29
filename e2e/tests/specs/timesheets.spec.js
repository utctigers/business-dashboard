const { test, expect } = require('@playwright/test');
const TimesheetsPage = require('../pages/TimesheetsPage');

test.describe('Timesheets Page', () => {
  let timesheetsPage;

  test.beforeEach(async ({ page }) => {
    timesheetsPage = new TimesheetsPage(page);
    await timesheetsPage.navigateToTimesheets();
  });

  test('should display employee location map', async () => {
    await expect(timesheetsPage.page.locator(timesheetsPage.selectors.mapTitle)).toBeVisible();
    await expect(timesheetsPage.page.locator(timesheetsPage.selectors.mapElement)).toBeVisible();
    
    const mapElement = await timesheetsPage.getMapElement();
    await expect(mapElement).toHaveCSS('height', '400px');
  });

  test('should show timesheet table below map', async () => {
    const mapVisible = await timesheetsPage.isMapVisible();
    expect(mapVisible).toBe(true);
    
    await expect(timesheetsPage.page.locator(timesheetsPage.selectors.timesheetTable)).toBeVisible();
  });
});