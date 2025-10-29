import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = environment.apiUrl;
  private mockDatabase = new Map();
  private auroraConfig = environment.aurora;

  constructor(private http: HttpClient) {
    const mode = environment.useMockData ? 'MOCK' : 'API';
    console.log(`Database Service Mode: ${mode}`);
    if (!environment.useMockData) {
      console.log(`API Endpoint: ${this.apiUrl}`);
    }
    console.log(`Aurora DSQL Cluster: ${this.auroraConfig.endpoint}`);
    
    // Initialize mock data for fallback
    this.mockDatabase.set('employees', [
      { id: 1, name: 'John Smith', email: 'john@company.com', phone: '(555) 123-4567', department: 'Engineering', role: 'Senior', salary: 85000, start_date: '2023-01-15', status: 'Active' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', phone: '(555) 234-5678', department: 'Marketing', role: 'Manager', salary: 95000, start_date: '2022-11-20', status: 'Active' },
      { id: 3, name: 'Mike Davis', email: 'mike@company.com', phone: '(555) 345-6789', department: 'Sales', role: 'Senior', salary: 78000, start_date: '2023-03-10', status: 'On Leave' },
      { id: 4, name: 'Lisa Wilson', email: 'lisa@company.com', phone: '(555) 456-7890', department: 'HR', role: 'Manager', salary: 92000, start_date: '2022-08-05', status: 'Active' }
    ]);
    
    this.mockDatabase.set('inventory', [
      { id: 1, name: 'Office Chairs', sku: 'OFC-001', category: 'Furniture', stock: 15, min_stock: 10, max_stock: 50, price: 299.99 },
      { id: 2, name: 'Laptops', sku: 'LTP-002', category: 'Electronics', stock: 5, min_stock: 8, max_stock: 25, price: 1299.99 },
      { id: 3, name: 'Printer Paper', sku: 'PPR-003', category: 'Supplies', stock: 45, min_stock: 20, max_stock: 100, price: 12.99 },
      { id: 4, name: 'Desk Lamps', sku: 'DLM-004', category: 'Furniture', stock: 0, min_stock: 5, max_stock: 20, price: 89.99 },
      { id: 5, name: 'Keyboards', sku: 'KBD-005', category: 'Electronics', stock: 12, min_stock: 10, max_stock: 30, price: 79.99 }
    ]);
    
    this.mockDatabase.set('timesheets', [
      { id: 1, employee_id: 1, employee_name: 'John Smith', date: '2024-01-15', hours_worked: 8, project: 'Website Development', status: 'Approved', login_time: '09:00', logout_time: '17:00' },
      { id: 2, employee_id: 2, employee_name: 'Sarah Johnson', date: '2024-01-15', hours_worked: 7.5, project: 'Marketing Campaign', status: 'Pending', login_time: '08:30', logout_time: '16:00' },
      { id: 3, employee_id: 1, employee_name: 'John Smith', date: '2024-01-16', hours_worked: 8, project: 'Database Migration', status: 'Approved', login_time: '09:15', logout_time: '17:15' },
      { id: 4, employee_id: 3, employee_name: 'Mike Davis', date: '2024-01-16', hours_worked: 6, project: 'Client Meeting', status: 'Submitted', login_time: '10:00', logout_time: '16:00' },
      { id: 5, employee_id: 4, employee_name: 'Lisa Wilson', date: '2024-01-17', hours_worked: 7, project: 'HR Training', status: 'Submitted', login_time: '08:45', logout_time: '15:45' },
      { id: 6, employee_id: 1, employee_name: 'John Smith', date: '2024-01-18', hours_worked: 8.5, project: 'Code Review', status: 'Approved', login_time: '08:30', logout_time: '17:00' },
      { id: 7, employee_id: 2, employee_name: 'Sarah Johnson', date: '2024-01-18', hours_worked: 8, project: 'Social Media Strategy', status: 'Approved', login_time: '09:00', logout_time: '17:00' }
    ]);
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    // Aurora DSQL Query - Cluster: 4vthvxld47txd4lmgqpjzagqki
    const mode = environment.useMockData ? 'MOCK' : 'REAL';
    console.log(`[${mode}] Executing on ${this.auroraConfig.clusterId}:`, sql, params);
    
    if (!environment.useMockData) {
      return this.executeRealDSQLQuery(sql, params);
    }
    
    // Use mock data for development
    return this.executeMockQuery(sql, params);
  }

  private async executeRealDSQLQuery(sql: string, params?: any[]): Promise<any[]> {
    try {
      console.log('🌐 Making API call to backend:', this.apiUrl);
      
      if (sql.includes('SELECT * FROM employees')) {
        const response = await this.http.get<any[]>(`${this.apiUrl}/employees`).toPromise();
        console.log('✅ API Response:', response);
        return response || [];
      }
      
      if (sql.includes('SELECT * FROM inventory')) {
        const response = await this.http.get<any[]>(`${this.apiUrl}/inventory`).toPromise();
        console.log('✅ Inventory API Response:', response);
        return response || [];
      }
      
      if (sql.includes('INSERT INTO employees')) {
        const employee = params?.[0];
        console.log('📝 Creating employee via API:', employee);
        const response = await this.http.post<any>(`${this.apiUrl}/employees`, employee).toPromise();
        return [response];
      }
      
      if (sql.includes('UPDATE employees')) {
        const [employeeData, id] = params || [];
        console.log('✏️ Updating employee via API:', id, employeeData);
        const response = await this.http.put<any>(`${this.apiUrl}/employees/${id}`, employeeData).toPromise();
        return [response];
      }
      
      if (sql.includes('DELETE FROM employees')) {
        const id = params?.[0];
        console.log('🗑️ Deleting employee via API:', id);
        await this.http.delete(`${this.apiUrl}/employees/${id}`).toPromise();
        return [{ affectedRows: 1 }];
      }
      
      if (sql.includes('INSERT INTO inventory')) {
        const item = params?.[0];
        console.log('📝 Creating inventory item via API:', item);
        const response = await this.http.post<any>(`${this.apiUrl}/inventory`, item).toPromise();
        return [response];
      }
      
      if (sql.includes('UPDATE inventory')) {
        const [itemData, id] = params || [];
        console.log('✏️ Updating inventory item via API:', id, itemData);
        const response = await this.http.put<any>(`${this.apiUrl}/inventory/${id}`, itemData).toPromise();
        return [response];
      }
      
      if (sql.includes('DELETE FROM inventory')) {
        const id = params?.[0];
        console.log('🗑️ Deleting inventory item via API:', id);
        await this.http.delete(`${this.apiUrl}/inventory/${id}`).toPromise();
        return [{ affectedRows: 1 }];
      }
      
      if (sql.includes('UPDATE inventory SET stock = ? WHERE id = ?')) {
        const [maxStock, id] = params || [];
        console.log('🔄 Reordering inventory item via API:', id, 'to stock:', maxStock);
        const response = await this.http.put<any>(`${this.apiUrl}/inventory/${id}/reorder`, { maxStock }).toPromise();
        return [response];
      }
      
      if (sql.includes('SELECT * FROM timesheets')) {
        const response = await this.http.get<any[]>(`${this.apiUrl}/timesheets`).toPromise();
        console.log('✅ Timesheets API Response:', response);
        return response || [];
      }
      
      if (sql.includes('INSERT INTO timesheets')) {
        const timesheet = params?.[0];
        console.log('📝 Creating timesheet via API:', timesheet);
        const response = await this.http.post<any>(`${this.apiUrl}/timesheets`, timesheet).toPromise();
        return [response];
      }
      
      if (sql.includes('UPDATE timesheets')) {
        const [timesheetData, id] = params || [];
        console.log('✏️ Updating timesheet via API:', id, timesheetData);
        const response = await this.http.put<any>(`${this.apiUrl}/timesheets/${id}`, timesheetData).toPromise();
        return [response];
      }
      
      if (sql.includes('DELETE FROM timesheets')) {
        const id = params?.[0];
        console.log('🗑️ Deleting timesheet via API:', id);
        await this.http.delete(`${this.apiUrl}/timesheets/${id}`).toPromise();
        return [{ affectedRows: 1 }];
      }
      
      return [];
    } catch (error) {
      console.error('❌ API call failed:', error);
      console.warn('🔄 Falling back to mock data');
      return this.executeMockQuery(sql, params);
    }
  }

  private executeMockQuery(sql: string, params?: any[]): any[] {
    if (sql.includes('SELECT * FROM employees')) {
      return this.mockDatabase.get('employees') || [];
    }
    
    if (sql.includes('INSERT INTO employees')) {
      const employees = this.mockDatabase.get('employees') || [];
      const employee = params?.[0];
      if (employee) {
        employees.push(employee);
        this.mockDatabase.set('employees', employees);
        return [{ insertId: employee.id, affectedRows: 1 }];
      }
      return [{ error: 'No employee data provided' }];
    }
    
    if (sql.includes('UPDATE employees')) {
      const employees = this.mockDatabase.get('employees') || [];
      const [employeeData, id] = params || [];
      const index = employees.findIndex((emp: any) => emp.id === id);
      if (index !== -1) {
        employees[index] = { ...employees[index], ...employeeData };
        this.mockDatabase.set('employees', employees);
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }
    
    if (sql.includes('DELETE FROM employees WHERE id')) {
      const employees = this.mockDatabase.get('employees') || [];
      const id = params?.[0];
      const initialLength = employees.length;
      const filtered = employees.filter((emp: any) => emp.id !== id);
      this.mockDatabase.set('employees', filtered);
      return [{ affectedRows: initialLength - filtered.length }];
    }
    
    // Inventory mock queries
    if (sql.includes('SELECT * FROM inventory')) {
      return this.mockDatabase.get('inventory') || [];
    }
    
    if (sql.includes('INSERT INTO inventory')) {
      const inventory = this.mockDatabase.get('inventory') || [];
      const item = params?.[0];
      if (item) {
        item.id = Date.now();
        inventory.push(item);
        this.mockDatabase.set('inventory', inventory);
        return [{ insertId: item.id, affectedRows: 1 }];
      }
      return [{ error: 'No inventory data provided' }];
    }
    
    if (sql.includes('UPDATE inventory')) {
      const inventory = this.mockDatabase.get('inventory') || [];
      const [itemData, id] = params || [];
      const index = inventory.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        inventory[index] = { ...inventory[index], ...itemData };
        this.mockDatabase.set('inventory', inventory);
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }
    
    if (sql.includes('DELETE FROM inventory')) {
      const inventory = this.mockDatabase.get('inventory') || [];
      const id = params?.[0];
      const initialLength = inventory.length;
      const filtered = inventory.filter((item: any) => item.id !== id);
      this.mockDatabase.set('inventory', filtered);
      return [{ affectedRows: initialLength - filtered.length }];
    }
    
    if (sql.includes('UPDATE inventory SET stock = ? WHERE id = ?')) {
      const inventory = this.mockDatabase.get('inventory') || [];
      const [maxStock, id] = params || [];
      const index = inventory.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        inventory[index].stock = maxStock;
        this.mockDatabase.set('inventory', inventory);
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }
    
    // Timesheet mock queries
    if (sql.includes('SELECT * FROM timesheets')) {
      return this.mockDatabase.get('timesheets') || [];
    }
    
    if (sql.includes('INSERT INTO timesheets')) {
      const timesheets = this.mockDatabase.get('timesheets') || [];
      const timesheet = params?.[0];
      if (timesheet) {
        timesheet.id = Date.now();
        timesheets.push(timesheet);
        this.mockDatabase.set('timesheets', timesheets);
        return [{ insertId: timesheet.id, affectedRows: 1 }];
      }
      return [{ error: 'No timesheet data provided' }];
    }
    
    if (sql.includes('UPDATE timesheets')) {
      const timesheets = this.mockDatabase.get('timesheets') || [];
      const [timesheetData, id] = params || [];
      const index = timesheets.findIndex((ts: any) => ts.id === id);
      if (index !== -1) {
        timesheets[index] = { ...timesheets[index], ...timesheetData };
        this.mockDatabase.set('timesheets', timesheets);
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }
    
    if (sql.includes('DELETE FROM timesheets')) {
      const timesheets = this.mockDatabase.get('timesheets') || [];
      const id = params?.[0];
      const initialLength = timesheets.length;
      const filtered = timesheets.filter((ts: any) => ts.id !== id);
      this.mockDatabase.set('timesheets', filtered);
      return [{ affectedRows: initialLength - filtered.length }];
    }
    
    return [];
  }
}