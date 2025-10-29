const BasePage = require('./BasePage');

class EmployeesPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      pageTitle: 'h1:has-text("Employees")',
      addEmployeeBtn: 'button:has-text("Add Employee")',
      employeeTable: 'table',
      employeeRows: 'tbody tr',
      addForm: '.add-form',
      formTitle: '.add-form h3',
      nameInput: '#employeeName',
      emailInput: '#employeeEmail',
      phoneInput: '#employeePhone',
      salaryInput: '#employeeSalary',
      departmentSelect: '#employeeDepartment',
      roleSelect: '#employeeRole',
      startDateInput: '#employeeStartDate',
      statusSelect: '#employeeStatus',
      saveBtn: 'button:has-text("Add Employee")',
      cancelBtn: 'button:has-text("Cancel")',
      editBtn: 'button:has-text("Edit")',
      removeBtn: 'button:has-text("Remove")'
    };
  }

  async navigateToEmployees() {
    await this.navigate('/employees');
    await this.waitForNavigation();
  }

  async clickAddEmployee() {
    await this.click(this.selectors.addEmployeeBtn);
    await this.waitForElement(this.selectors.addForm);
  }

  async fillEmployeeForm(name, email, phone, salary, department, role, startDate, status = 'Active') {
    await this.fill(this.selectors.nameInput, name);
    await this.fill(this.selectors.emailInput, email);
    await this.fill(this.selectors.phoneInput, phone);
    await this.fill(this.selectors.salaryInput, salary);
    await this.page.selectOption(this.selectors.departmentSelect, department);
    await this.page.selectOption(this.selectors.roleSelect, role);
    await this.fill(this.selectors.startDateInput, startDate);
    await this.page.selectOption(this.selectors.statusSelect, status);
  }

  async closeModal() {
    await this.click(this.selectors.cancelBtn);
    await this.page.waitForSelector(this.selectors.addForm, { state: 'hidden' });
  }

  async isModalVisible() {
    return await this.isVisible(this.selectors.addForm);
  }

  async saveEmployee() {
    await this.click(this.selectors.saveBtn);
    await this.page.waitForSelector(this.selectors.addForm, { state: 'hidden' });
  }

  async getEmployeeCount() {
    await this.waitForElement(this.selectors.employeeTable);
    const rows = await this.page.locator(this.selectors.employeeRows);
    return await rows.count();
  }

  async isFormVisible() {
    return await this.isVisible(this.selectors.addForm);
  }

  async cancelForm() {
    await this.click(this.selectors.cancelBtn);
  }

  async isEmployeeInTable(employeeName) {
    await this.waitForElement(this.selectors.employeeTable);
    const employeeRow = this.page.locator(`tbody tr:has-text("${employeeName}")`);
    return await employeeRow.count() > 0;
  }
}

module.exports = EmployeesPage;