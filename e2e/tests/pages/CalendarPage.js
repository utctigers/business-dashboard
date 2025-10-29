const BasePage = require('./BasePage');

class CalendarPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      pageTitle: '#calendarTitle',
      calendarHeader: '#calendarHeader',
      currentMonth: '#currentMonth',
      prevMonthBtn: '#prevMonthBtn',
      nextMonthBtn: '#nextMonthBtn',
      calendarDays: '[id^="calendarDay"]',
      todayCell: '.calendar-day.today',
      jobsPanel: '#jobsPanel',
      addJobBtn: '#addJobBtn',
      jobItems: '[id^="jobItem"]',
      modal: '.modal',
      jobTitleInput: '#jobTitle',
      jobClientInput: '#jobClient',
      jobDateInput: '#jobDate',
      jobTimeInput: '#jobTime',
      prioritySelect: '#jobPriority',
      saveJobBtn: '#saveJobBtn',
      cancelBtn: '#cancelJobBtn'
    };
  }

  async navigateToCalendar() {
    await this.navigate('/calendar');
    await this.waitForNavigation();
  }

  async getCurrentMonth() {
    return await this.getText(this.selectors.currentMonth);
  }

  async clickNextMonth() {
    await this.click(this.selectors.nextMonthBtn);
  }

  async clickPrevMonth() {
    await this.click(this.selectors.prevMonthBtn);
  }

  async clickAddJob() {
    await this.click(this.selectors.addJobBtn);
    await this.waitForElement(this.selectors.modal);
  }

  async fillJobForm(title, client, date, time, priority) {
    await this.fill(this.selectors.jobTitleInput, title);
    await this.fill(this.selectors.jobClientInput, client);
    await this.fill(this.selectors.jobDateInput, date);
    await this.fill(this.selectors.jobTimeInput, time);
    await this.page.selectOption(this.selectors.prioritySelect, priority);
  }

  async saveJob() {
    await this.click(this.selectors.saveJobBtn);
    await this.page.waitForSelector(this.selectors.modal, { state: 'hidden' });
  }

  async getJobCount() {
    await this.waitForElement(this.selectors.jobsPanel);
    const jobs = await this.page.locator(this.selectors.jobItems);
    return await jobs.count();
  }

  async isJobInList(jobTitle) {
    await this.waitForElement(this.selectors.jobsPanel);
    const jobItem = this.page.locator(`[id^="jobItem"]:has-text("${jobTitle}")`);
    return await jobItem.count() > 0;
  }

  async getCalendarDaysCount() {
    await this.waitForElement(this.selectors.calendarDays);
    const days = await this.page.locator(this.selectors.calendarDays);
    return await days.count();
  }

  async isTodayHighlighted() {
    return await this.isVisible(this.selectors.todayCell);
  }
}

module.exports = CalendarPage;