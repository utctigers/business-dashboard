const { test, expect } = require('@playwright/test');
const CalendarPage = require('../pages/CalendarPage');

test.describe('Calendar Page', () => {
  let calendarPage;

  test.beforeEach(async ({ page }) => {
    calendarPage = new CalendarPage(page);
    await calendarPage.navigateToCalendar();
  });

  test('should display calendar page', async () => {
    await expect(calendarPage.page).toHaveURL(/.*calendar/);
  });

  test('should display current month', async () => {
    const currentMonth = await calendarPage.getCurrentMonth();
    expect(currentMonth).toBeTruthy();
  });

  test('should navigate between months', async () => {
    const initialMonth = await calendarPage.getCurrentMonth();
    
    await calendarPage.clickNextMonth();
    const nextMonth = await calendarPage.getCurrentMonth();
    expect(nextMonth).not.toBe(initialMonth);
    
    await calendarPage.clickPrevMonth();
    const backToInitial = await calendarPage.getCurrentMonth();
    expect(backToInitial).toBe(initialMonth);
  });

  test('should display calendar days', async () => {
    const daysCount = await calendarPage.getCalendarDaysCount();
    expect(daysCount).toBe(43); // 6 weeks * 7 days
  });

  test('should highlight today', async () => {
    const isTodayHighlighted = await calendarPage.isTodayHighlighted();
    expect(isTodayHighlighted).toBe(true);
  });

  test('should add new job', async () => {
    const initialJobCount = await calendarPage.getJobCount();
    
    await calendarPage.clickAddJob();
    await calendarPage.fillJobForm(
      'Test Meeting',
      'Test Client',
      '2024-12-31',
      '10:00',
      'high'
    );
    await calendarPage.saveJob();
    
    const newJobCount = await calendarPage.getJobCount();
    expect(newJobCount).toBe(initialJobCount + 1);
  });
});