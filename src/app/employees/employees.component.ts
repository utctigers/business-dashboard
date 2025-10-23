import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="employees">
      <div class="header">
        <h1>Employee Management</h1>
        <button class="btn-primary" (click)="toggleAddForm()">
          {{ showAddForm ? 'Cancel' : 'Add Employee' }}
        </button>
      </div>
      
      <div class="add-form" *ngIf="showAddForm">
        <h3>{{ editMode ? 'Edit Employee' : 'Add New Employee' }}</h3>
        <div>
          <div class="form-row">
            <input [value]="newEmployee.name" (input)="newEmployee.name = $any($event.target).value" placeholder="Full Name">
            <input [value]="newEmployee.email" (input)="newEmployee.email = $any($event.target).value" type="email" placeholder="Email">
          </div>
          <div class="form-row">
            <input [value]="newEmployee.phone" (input)="newEmployee.phone = $any($event.target).value" placeholder="Phone Number">
            <input [value]="newEmployee.salary" (input)="newEmployee.salary = $any($event.target).value" type="number" placeholder="Annual Salary">
          </div>
          <div class="form-row">
            <select [value]="newEmployee.department" (change)="newEmployee.department = $any($event.target).value">
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
            <select [value]="newEmployee.role" (change)="newEmployee.role = $any($event.target).value">
              <option value="">Select Role</option>
              <option value="Manager">Manager</option>
              <option value="Senior">Senior</option>
              <option value="Junior">Junior</option>
              <option value="Intern">Intern</option>
            </select>
          </div>
          <div class="form-row">
            <input [value]="newEmployee.startDate" (input)="newEmployee.startDate = $any($event.target).value" type="date">
            <select [value]="newEmployee.status" (change)="newEmployee.status = $any($event.target).value">
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-primary" (click)="saveEmployee()">
              {{ editMode ? 'Update Employee' : 'Add Employee' }}
            </button>
            <button type="button" class="btn-secondary" (click)="cancelForm()">Cancel</button>
          </div>
        </div>
      </div>
      
      <div class="employees-table">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Role</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let employee of employees">
              <td>
                <div class="employee-info">
                  <div class="avatar">{{ employee.name.charAt(0) }}</div>
                  <div>
                    <div class="employee-name">{{ employee.name }}</div>
                    <div class="employee-email">{{ employee.email }}</div>
                    <div class="employee-phone">{{ employee.phone }}</div>
                  </div>
                </div>
              </td>
              <td>{{ employee.department }}</td>
              <td>{{ employee.role }}</td>
              <td>{{ employee.salary | number }}</td>
              <td><span class="status" [class]="employee.status.toLowerCase().replace(' ', '-')">{{ employee.status }}</span></td>
              <td>{{ employee.startDate }}</td>
              <td>
                <button class="btn-small" (click)="editEmployee(employee)">Edit</button>
                <button class="btn-small btn-danger" (click)="removeEmployee(employee.id)">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .employees h1 { color: #2d3748; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; }
    .add-form { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 2rem; }
    .add-form h3 { margin-bottom: 1rem; color: #2d3748; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    input, select { padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 6px; }
    .employees-table { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #f0f0f0; }
    th { background: #f8f9fa; font-weight: 600; color: #2d3748; }
    .employee-info { display: flex; align-items: center; gap: 0.75rem; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: #667eea; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }
    .employee-name { font-weight: 500; color: #2d3748; }
    .employee-email { font-size: 0.875rem; color: #666; }
    .employee-phone { font-size: 0.75rem; color: #999; }
    .status { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; font-weight: 500; }
    .status.active { background: #dcfce7; color: #166534; }
    .status.on-leave { background: #fef3c7; color: #92400e; }
    .status.inactive { background: #fee2e2; color: #dc2626; }
    .form-actions { display: flex; gap: 1rem; }
    .btn-secondary { background: #f8f9fa; color: #2d3748; border: 2px solid #e2e8f0; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; }
    .btn-small { padding: 0.25rem 0.75rem; border: 1px solid #e2e8f0; background: white; border-radius: 4px; cursor: pointer; font-size: 0.875rem; }
    .btn-danger { border-color: #ef4444; color: #ef4444; }
  `]
})
export class EmployeesComponent implements OnInit {
  showAddForm = false;
  editMode = false;
  editingId: number | null = null;
  employees: any[] = [];
  
  newEmployee = {
    name: '', email: '', phone: '', department: '', role: '', 
    salary: '', startDate: '', status: 'Active'
  };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.employees = this.employeeService.getEmployees();
    this.employeeService.employees$.subscribe(employees => {
      this.employees = employees;
    });
  }
  
  toggleAddForm() {
    if (this.showAddForm) {
      this.cancelForm();
    } else {
      this.showAddForm = true;
      this.editMode = false;
    }
  }
  
  async saveEmployee() {
    if (!this.newEmployee.name || !this.newEmployee.email || !this.newEmployee.department || !this.newEmployee.role) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      if (this.editMode && this.editingId) {
        console.log('Updating employee via Aurora DSQL');
        await this.employeeService.updateEmployee(this.editingId, {
          ...this.newEmployee,
          salary: this.newEmployee.salary ? +this.newEmployee.salary : 0
        });
      } else {
        const employee = { 
          id: Date.now(), 
          ...this.newEmployee, 
          salary: this.newEmployee.salary ? +this.newEmployee.salary : 0 
        };
        console.log('Adding employee via Aurora DSQL');
        await this.employeeService.addEmployee(employee);
      }
      this.cancelForm();
    } catch (error) {
      console.error('Aurora DSQL operation failed:', error);
      alert('Failed to save employee. Please try again.');
    }
  }
  
  editEmployee(employee: any) {
    this.editMode = true;
    this.editingId = employee.id;
    this.newEmployee = { 
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      salary: employee.salary.toString(),
      startDate: employee.startDate,
      status: employee.status
    };
    this.showAddForm = true;
  }
  
  async removeEmployee(id: number) {
    if (confirm('Remove this employee from Aurora DSQL database?')) {
      try {
        console.log('Removing employee via Aurora DSQL:', id);
        await this.employeeService.removeEmployee(id);
      } catch (error) {
        console.error('Aurora DSQL delete failed:', error);
        alert('Failed to remove employee. Please try again.');
      }
    }
  }
  
  cancelForm() {
    this.showAddForm = false;
    this.editMode = false;
    this.editingId = null;
    this.newEmployee = { 
      name: '', email: '', phone: '', department: '', role: '', 
      salary: '', startDate: '', status: 'Active' 
    };
  }
}