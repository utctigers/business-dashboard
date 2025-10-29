const { test, expect } = require('@playwright/test');
const EmployeesPage = require('../pages/EmployeesPage');

test.describe('Employees Page', () => {
  let employeesPage;

  test.beforeEach(async ({ page }) => {
    employeesPage = new EmployeesPage(page);
    await employeesPage.navigateToEmployees();
  });

  test('should display employees page', async () => {
    await expect(employeesPage.page).toHaveURL(/.*employees/);
  });

  test('should open add employee modal', async () => {
    await employeesPage.clickAddEmployee();
    const isModalVisible = await employeesPage.isFormVisible();
    expect(isModalVisible).toBe(true);
  });

  test('should add new employee', async () => {
    await employeesPage.clickAddEmployee();
    await employeesPage.fillEmployeeForm(
      'John Doe',
      'john.doe@example.com',
      '864-555-1234',
      '75000',
      'Engineering',
      'Manager',
      '2024-01-15',
      'Active'
    );
    await employeesPage.saveEmployee();
    
    const isEmployeeAdded = await employeesPage.isEmployeeInTable('John Doe');
    expect(isEmployeeAdded).toBe(true);
  });

  test('should close modal when clicking cancel', async () => {
    await employeesPage.clickAddEmployee();
    await employeesPage.closeModal();
    
    const isModalVisible = await employeesPage.isModalVisible();
    expect(isModalVisible).toBe(false);
  });
});