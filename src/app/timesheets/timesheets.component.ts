import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../service/database.service';
import * as XLSX from 'xlsx';
import * as L from 'leaflet';

@Component({
  selector: 'app-timesheets',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timesheets">
      <div class="header">
        <h1>Employee Timesheets</h1>
        <div class="header-actions">
          <button class="btn-secondary" (click)="generateReport()">Generate Report</button>
          <button class="btn-primary" (click)="openModal(false)">Add Timesheet</button>
        </div>
      </div>
      
      <div class="filters">
        <select [value]="selectedPeriod" (change)="selectedPeriod = $any($event.target).value; filterTimesheets()">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
        <select [value]="selectedEmployee" (change)="selectedEmployee = $any($event.target).value; filterTimesheets()">
          <option value="">All Employees</option>
          <option *ngFor="let emp of employees" [value]="emp.id">{{ emp.name }}</option>
        </select>
      </div>
      
      <div class="map-container">
        <h3>Employee Locations</h3>
        <div id="map" style="height: 400px; width: 100%; margin-bottom: 2rem;"></div>
      </div>
      
      <div class="timesheet-table">
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Date</th>
              <th>Hours</th>
              <th>Project</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let timesheet of timesheets">
              <td>{{ timesheet.employee_name || 'Employee ' + timesheet.employee_id }}</td>
              <td>{{ timesheet.date }}</td>
              <td>{{ timesheet.hours_worked }}h</td>
              <td>{{ timesheet.project }}</td>
              <td>
                <span class="status" [class]="timesheet.status.toLowerCase()">
                  {{ timesheet.status }}
                </span>
              </td>
              <td>
                <button class="btn-small" (click)="viewEmployee(timesheet.employee_id)">View</button>
                <button class="btn-small" (click)="openModal(true, timesheet)">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="modal" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h4>{{ isEditing ? 'Edit' : 'Add' }} Timesheet</h4>
          <button class="close" (click)="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          <input type="number" [value]="currentTimesheet.employee_id" (input)="currentTimesheet.employee_id = +$any($event.target).value" placeholder="Employee ID">
          <input type="date" [value]="currentTimesheet.date" (input)="currentTimesheet.date = $any($event.target).value" placeholder="Date">
          <input type="number" [value]="currentTimesheet.hours_worked" (input)="currentTimesheet.hours_worked = +$any($event.target).value" placeholder="Hours Worked" step="0.5">
          <input type="text" [value]="currentTimesheet.project" (input)="currentTimesheet.project = $any($event.target).value" placeholder="Project">
          <select [value]="currentTimesheet.status" (change)="currentTimesheet.status = $any($event.target).value">
            <option value="">Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
          </select>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" (click)="saveTimesheet()">{{ isEditing ? 'Update' : 'Add' }}</button>
          <button class="btn-secondary" (click)="closeModal()">Cancel</button>
        </div>
      </div>
      
      <div class="modal" *ngIf="showViewModal" (click)="closeViewModal()">
        <div class="modal-dialog view-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h4>{{ viewEmployeeName }} - Time Report</h4>
            <button class="close" (click)="closeViewModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="period-selector">
              <select [value]="viewPeriod" (change)="setViewPeriod($any($event.target).value)">
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <button class="btn-small" (click)="generateEmployeeReport()">Generate Report</button>
            </div>
            <div class="time-summary">
              <h5>Total Hours: {{ getTotalHours() }}</h5>
            </div>
            <table class="view-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Login</th>
                  <th>Logout</th>
                  <th>Hours</th>
                  <th>Project</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let entry of filteredViewTimesheets">
                  <td>{{ entry.date }}</td>
                  <td>{{ entry.login_time }}</td>
                  <td>{{ entry.logout_time }}</td>
                  <td>{{ entry.hours_worked }}h</td>
                  <td>{{ entry.project }}</td>
                  <td><span class="status" [class]="entry.status.toLowerCase()">{{ entry.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timesheets h1 { color: #2d3748; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .btn-primary, .btn-secondary { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .btn-secondary { background: white; color: #667eea; border: 2px solid #667eea; }
    .timesheet-table { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #f0f0f0; }
    th { background: #f8f9fa; font-weight: 600; color: #2d3748; }
    .status { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; font-weight: 500; }
    .status.submitted { background: #dcfce7; color: #166534; }
    .status.pending { background: #fef3c7; color: #92400e; }
    .status.approved { background: #dbeafe; color: #1e40af; }
    .btn-small { padding: 0.25rem 0.75rem; border: 1px solid #e2e8f0; background: white; border-radius: 4px; cursor: pointer; font-size: 0.875rem; }
    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-dialog { background: white; border-radius: 8px; width: 500px; max-width: 90%; }
    .modal-header { padding: 1rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h4 { margin: 0; }
    .close { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
    .modal-body { padding: 1rem; }
    .modal-body input, .modal-body select { width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 4px; }
    .modal-footer { padding: 1rem; border-top: 1px solid #eee; text-align: right; }
    .modal-footer button { margin-left: 0.5rem; }
    .header-actions { display: flex; gap: 1rem; }
    .filters { display: flex; gap: 1rem; margin-bottom: 2rem; }
    .filters select { padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    .view-modal { width: 700px; }
    .period-selector { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; }
    .period-selector select { padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    .time-summary { margin-bottom: 1rem; }
    .view-table { width: 100%; }
    .view-table th, .view-table td { padding: 0.5rem; border-bottom: 1px solid #eee; }
    .map-container { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .map-container h3 { margin: 0 0 1rem 0; color: #2d3748; }
  `]
})
export class TimesheetsComponent implements OnInit, AfterViewInit {
  timesheets: any[] = [];
  filteredTimesheets: any[] = [];
  employees: any[] = [];
  showModal = false;
  showViewModal = false;
  isEditing = false;
  selectedPeriod = 'month';
  selectedEmployee = '';
  viewEmployeeId = 0;
  viewEmployeeName = '';
  viewPeriod = 'month';
  filteredViewTimesheets: any[] = [];
  currentTimesheet: any = {
    id: null,
    employee_id: 0,
    date: '',
    hours_worked: 0,
    project: '',
    status: ''
  };

  private map: any;
  private employeeLocations = [
    { id: 1, name: 'John Smith', lat: 40.7128, lng: -74.0060, status: 'logged-in' },
    { id: 2, name: 'Sarah Johnson', lat: 40.7589, lng: -73.9851, status: 'logged-out' },
    { id: 3, name: 'Mike Davis', lat: 40.7505, lng: -73.9934, status: 'logged-in' },
    { id: 4, name: 'Emily Brown', lat: 40.7282, lng: -73.7949, status: 'logged-in' }
  ];

  constructor(private db: DatabaseService) {}

  ngOnInit() {
    this.loadTimesheets();
    this.loadEmployees();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    this.map = L.map('map').setView([40.7128, -74.0060], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    
    this.employeeLocations.forEach(emp => {
      const color = emp.status === 'logged-in' ? 'green' : 'red';
      const marker = L.circleMarker([emp.lat, emp.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.7,
        radius: 8
      }).addTo(this.map);
      
      marker.bindPopup(`<b>${emp.name}</b><br>Status: ${emp.status}`);
    });
  }

  async loadTimesheets() {
    try {
      this.timesheets = await this.db.query('SELECT * FROM timesheets ORDER BY date DESC');
      this.filteredTimesheets = [...this.timesheets];
    } catch (error) {
      console.error('Error loading timesheets:', error);
    }
  }

  async loadEmployees() {
    try {
      this.employees = await this.db.query('SELECT * FROM employees');
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }

  openModal(editing: boolean, timesheet?: any) {
    this.isEditing = editing;
    if (editing && timesheet) {
      this.currentTimesheet = { ...timesheet };
    } else {
      this.resetForm();
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  async saveTimesheet() {
    try {
      if (this.isEditing && this.currentTimesheet.id) {
        await this.db.query(
          'UPDATE timesheets SET employee_id = ?, date = ?, hours_worked = ?, project = ?, status = ? WHERE id = ?',
          [this.currentTimesheet, this.currentTimesheet.id]
        );
      } else {
        await this.db.query(
          'INSERT INTO timesheets (employee_id, date, hours_worked, project, status) VALUES (?, ?, ?, ?, ?)',
          [this.currentTimesheet]
        );
      }
      this.closeModal();
      this.loadTimesheets();
    } catch (error) {
      console.error('Error saving timesheet:', error);
    }
  }

  filterTimesheets() {
    let filtered = [...this.timesheets];
    
    if (this.selectedEmployee) {
      filtered = filtered.filter(ts => ts.employee_id == this.selectedEmployee);
    }
    
    const now = new Date();
    if (this.selectedPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(ts => new Date(ts.date) >= weekAgo);
    } else if (this.selectedPeriod === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filtered = filtered.filter(ts => new Date(ts.date) >= monthAgo);
    } else if (this.selectedPeriod === 'year') {
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      filtered = filtered.filter(ts => new Date(ts.date) >= yearAgo);
    }
    
    this.filteredTimesheets = filtered;
  }

  viewEmployee(employeeId: number) {
    this.viewEmployeeId = employeeId;
    const employee = this.employees.find(emp => emp.id === employeeId);
    this.viewEmployeeName = employee ? employee.name : `Employee ${employeeId}`;
    this.filterViewTimesheets();
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
  }

  setViewPeriod(period: string) {
    this.viewPeriod = period;
    this.filterViewTimesheets();
  }

  generateEmployeeReport() {
    const data = this.filteredViewTimesheets.map(ts => ({
      'Employee': this.viewEmployeeName,
      'Date': ts.date,
      'Hours Worked': ts.hours_worked,
      'Project': ts.project,
      'Status': ts.status
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee Report');
    
    const fileName = `${this.viewEmployeeName.replace(' ', '_')}_${this.viewPeriod}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  filterViewTimesheets() {
    let filtered = this.timesheets.filter(ts => ts.employee_id === this.viewEmployeeId);
    
    const now = new Date();
    if (this.viewPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(ts => new Date(ts.date) >= weekAgo);
    } else if (this.viewPeriod === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filtered = filtered.filter(ts => new Date(ts.date) >= monthAgo);
    } else if (this.viewPeriod === 'year') {
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      filtered = filtered.filter(ts => new Date(ts.date) >= yearAgo);
    }
    
    this.filteredViewTimesheets = filtered;
  }

  getTotalHours(): number {
    return this.filteredViewTimesheets.reduce((total, ts) => total + ts.hours_worked, 0);
  }

  generateReport() {
    const data = this.filteredTimesheets.map(ts => ({
      'Employee': ts.employee_name || `Employee ${ts.employee_id}`,
      'Date': ts.date,
      'Hours Worked': ts.hours_worked,
      'Project': ts.project,
      'Status': ts.status
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Timesheets');
    
    const fileName = `timesheets_${this.selectedPeriod}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  resetForm() {
    this.currentTimesheet = {
      id: null,
      employee_id: 0,
      date: '',
      hours_worked: 0,
      project: '',
      status: ''
    };
  }
}