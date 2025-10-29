import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesSubject = new BehaviorSubject<any[]>([]);
  employees$ = this.employeesSubject.asObservable();

  constructor(private db: DatabaseService) {
    this.loadEmployees();
  }

  async loadEmployees() {
    try {
      console.log('🔄 Loading employees from database/API');
      const employees = await this.db.query('SELECT * FROM employees ORDER BY id');
      console.log('✅ Employees loaded:', employees.length, 'records');
      this.employeesSubject.next(employees);
    } catch (error) {
      console.error('❌ Failed to load employees:', error);
      // Keep existing data if load fails
    }
  }

  getEmployees() {
    return this.employeesSubject.value;
  }

  async addEmployee(employee: any) {
    console.log('Adding employee to Aurora DSQL:', employee);
    const result = await this.db.query(
      'INSERT INTO employees (id, name, email, phone, department, role, salary, start_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [employee]
    );
    console.log('Insert result:', result);
    this.loadEmployees();
  }

  async updateEmployee(id: number, employee: any) {
    console.log('Updating employee in Aurora DSQL:', id, employee);
    const result = await this.db.query(
      'UPDATE employees SET name = ?, email = ?, phone = ?, department = ?, role = ?, salary = ?, start_date = ?, status = ? WHERE id = ?', 
      [employee, id]
    );
    console.log('Update result:', result);
    this.loadEmployees();
  }

  async removeEmployee(id: number) {
    console.log('Removing employee from Aurora DSQL:', id);
    const result = await this.db.query('DELETE FROM employees WHERE id = ?', [id]);
    console.log('Delete result:', result);
    this.loadEmployees();
  }

  getActiveEmployeeCount() {
    return this.employeesSubject.value.filter(emp => emp.status === 'Active').length;
  }
}