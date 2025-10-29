const BasePage = require('./BasePage');

class TimesheetsPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      pageTitle: 'h1:has-text("Timesheets")',
      addTimesheetBtn: 'button:has-text("Add Timesheet")',
      timesheetTable: 'table',
      timesheetRows: 'tbody tr',
      modal: '.modal',
      employeeSelect: '#employeeId',
      dateInput: '#date',
      hoursInput: '#hoursWorked',
      projectInput: '#project',
      statusSelect: '#status',
      saveBtn: 'button:has-text("Add")',
      cancelBtn: 'button:has-text("Cancel")',
      editBtns: 'button:has-text("Edit")',
      deleteBtns: 'button:has-text("Delete")',
      mapContainer: '.map-container',
      mapElement: '#map',
      mapTitle: 'h3:has-text("Employee Locations")'
    };
  }

  async navigateToTimesheets() {
    await this.navigate('/timesheets');
    await this.waitForNavigation();
  }

  async clickAddTimesheet() {
    await this.click(this.selectors.addTimesheetBtn);
    await this.waitForElement(this.selectors.modal);
  }

  async fillTimesheetForm(employeeId, date, hours, project, status) {
    await this.page.selectOption(this.selectors.employeeSelect, employeeId.toString());
    await this.fill(this.selectors.dateInput, date);
    await this.fill(this.selectors.hoursInput, hours.toString());
    await this.fill(this.selectors.projectInput, project);
    await this.page.selectOption(this.selectors.statusSelect, status);
  }

  async saveTimesheet() {
    await this.click(this.selectors.saveBtn);
    await this.page.waitForSelector(this.selectors.modal, { state: 'hidden' });
  }

  async getTimesheetCount() {
    await this.waitForElement(this.selectors.timesheetTable);
    const rows = await this.page.locator(this.selectors.timesheetRows);
    return await rows.count();
  }

  async editFirstTimesheet() {
    const editBtns = await this.page.locator(this.selectors.editBtns);
    await editBtns.first().click();
    await this.waitForElement(this.selectors.modal);
  }

  async deleteFirstTimesheet() {
    const deleteBtns = await this.page.locator(this.selectors.deleteBtns);
    await deleteBtns.first().click();
  }

  async isMapVisible() {
    return await this.isVisible(this.selectors.mapContainer);
  }

  async getMapElement() {
    return await this.page.locator(this.selectors.mapElement);
  }
}

module.exports = TimesheetsPage;