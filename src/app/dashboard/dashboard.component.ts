import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <h1>Business Overview</h1>
      
      <div class="metrics-grid">
        <div class="metric-card" *ngFor="let metric of metrics" [routerLink]="metric.link" [class.clickable]="metric.link">
          <div class="metric-icon">{{ metric.icon }}</div>
          <div class="metric-content">
            <h3>{{ metric.value }}</h3>
            <p>{{ metric.label }}</p>
            <span class="metric-change" [class]="metric.trend">{{ metric.change }}</span>
          </div>
        </div>
      </div>
      
      <div class="dashboard-grid">
        <div class="card">
          <h3>Recent Activity</h3>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let activity of recentActivity">
              <span class="activity-icon">{{ activity.icon }}</span>
              <div class="activity-content">
                <p>{{ activity.description }}</p>
                <small>{{ activity.time }}</small>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h3>Quick Actions</h3>
          <div class="actions-grid">
            <button class="action-btn" *ngFor="let action of quickActions">
              <span class="action-icon">{{ action.icon }}</span>
              <span>{{ action.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard h1 {
      margin-bottom: 2rem;
      color: #2d3748;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .metric-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .metric-icon {
      font-size: 2rem;
    }
    
    .metric-content h3 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      color: #2d3748;
    }
    
    .metric-content p {
      margin: 0.25rem 0;
      color: #666;
    }
    
    .metric-change {
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .metric-change.positive { color: #10b981; }
    .metric-change.negative { color: #ef4444; }
    
    .metric-card.clickable {
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    
    .metric-card.clickable:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }
    
    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .card h3 {
      margin-bottom: 1rem;
      color: #2d3748;
    }
    
    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .activity-icon {
      font-size: 1.25rem;
    }
    
    .activity-content p {
      margin: 0;
      color: #2d3748;
    }
    
    .activity-content small {
      color: #666;
    }
    
    .actions-grid {
      display: grid;
      gap: 0.75rem;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #f8f9fa;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    
    .action-btn:hover {
      background: #e9ecef;
    }
    
    .action-icon {
      font-size: 1.25rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.updateEmployeeCount();
    this.employeeService.employees$.subscribe(() => {
      this.updateEmployeeCount();
    });
  }

  updateEmployeeCount() {
    const activeCount = this.employeeService.getActiveEmployeeCount();
    this.metrics[0].value = activeCount.toString();
  }

  metrics = [
    { icon: '👥', value: '4', label: 'Active Employees', change: '+2 this week', trend: 'positive', link: '/employees' },
    { icon: '📦', value: '1,247', label: 'Inventory Items', change: '-15 low stock', trend: 'negative' },
    { icon: '💰', value: '$45,230', label: 'Monthly Revenue', change: '+12% vs last month', trend: 'positive' },
    { icon: '⏰', value: '892', label: 'Hours Logged', change: '+5% this week', trend: 'positive' }
  ];
  
  recentActivity = [
    { icon: '✅', description: 'John Smith submitted timesheet', time: '2 minutes ago' },
    { icon: '📦', description: 'Low stock alert: Office Supplies', time: '15 minutes ago' },
    { icon: '💼', description: 'New employee onboarded: Sarah Johnson', time: '1 hour ago' },
    { icon: '📊', description: 'Weekly report generated', time: '2 hours ago' }
  ];
  
  quickActions = [
    { icon: '➕', label: 'Add Employee' },
    { icon: '📋', label: 'Generate Report' },
    { icon: '📦', label: 'Update Inventory' },
    { icon: '⚙️', label: 'System Settings' }
  ];
}