import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics">
      <div class="header">
        <h1>Business Analytics</h1>
        <div class="date-range">
          <select class="date-select">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
      </div>
      
      <div class="kpi-grid">
        <div class="kpi-card" *ngFor="let kpi of kpiMetrics">
          <div class="kpi-header">
            <span class="kpi-icon">{{ kpi.icon }}</span>
            <span class="kpi-change" [class]="kpi.trend">{{ kpi.change }}</span>
          </div>
          <h2>{{ kpi.value }}</h2>
          <p>{{ kpi.label }}</p>
        </div>
      </div>
      
      <div class="analytics-grid">
        <div class="chart-card">
          <h3>Revenue Trend</h3>
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div class="bar" *ngFor="let bar of chartData" [style.height.%]="bar.value">
                <span class="bar-label">{{ bar.label }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="insights-card">
          <h3>AI Insights</h3>
          <div class="insights-list">
            <div class="insight-item" *ngFor="let insight of aiInsights">
              <div class="insight-icon" [class]="insight.type">{{ insight.icon }}</div>
              <div class="insight-content">
                <h4>{{ insight.title }}</h4>
                <p>{{ insight.description }}</p>
                <span class="insight-confidence">{{ insight.confidence }}% confidence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="reports-section">
        <h3>Generated Reports</h3>
        <div class="reports-grid">
          <div class="report-card" *ngFor="let report of reports">
            <div class="report-icon">{{ report.icon }}</div>
            <div class="report-content">
              <h4>{{ report.title }}</h4>
              <p>{{ report.description }}</p>
              <small>Generated {{ report.date }}</small>
            </div>
            <button class="btn-download">Download</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics h1 {
      color: #2d3748;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .date-select {
      padding: 0.5rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      background: white;
    }
    
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .kpi-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .kpi-icon {
      font-size: 1.5rem;
    }
    
    .kpi-change {
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
    }
    
    .kpi-change.positive { background: #dcfce7; color: #166534; }
    .kpi-change.negative { background: #fee2e2; color: #dc2626; }
    
    .kpi-card h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0;
      color: #2d3748;
    }
    
    .kpi-card p {
      margin: 0.5rem 0 0 0;
      color: #666;
    }
    
    .analytics-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .chart-card, .insights-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .chart-card h3, .insights-card h3 {
      margin-bottom: 1rem;
      color: #2d3748;
    }
    
    .chart-placeholder {
      height: 200px;
      display: flex;
      align-items: end;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
    }
    
    .chart-bars {
      display: flex;
      align-items: end;
      gap: 1rem;
      height: 100%;
    }
    
    .bar {
      width: 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 20px;
    }
    
    .bar-label {
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.75rem;
      color: #666;
    }
    
    .insight-item {
      display: flex;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .insight-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
    
    .insight-icon.positive { background: #dcfce7; color: #166534; }
    .insight-icon.warning { background: #fef3c7; color: #92400e; }
    .insight-icon.info { background: #dbeafe; color: #1e40af; }
    
    .insight-content h4 {
      margin: 0 0 0.25rem 0;
      color: #2d3748;
      font-size: 0.875rem;
    }
    
    .insight-content p {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.875rem;
    }
    
    .insight-confidence {
      font-size: 0.75rem;
      color: #667eea;
      font-weight: 500;
    }
    
    .reports-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .reports-section h3 {
      margin-bottom: 1rem;
      color: #2d3748;
    }
    
    .reports-grid {
      display: grid;
      gap: 1rem;
    }
    
    .report-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    
    .report-icon {
      font-size: 1.5rem;
    }
    
    .report-content {
      flex: 1;
    }
    
    .report-content h4 {
      margin: 0 0 0.25rem 0;
      color: #2d3748;
    }
    
    .report-content p {
      margin: 0 0 0.25rem 0;
      color: #666;
      font-size: 0.875rem;
    }
    
    .report-content small {
      color: #999;
      font-size: 0.75rem;
    }
    
    .btn-download {
      padding: 0.5rem 1rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
    }
  `]
})
export class AnalyticsComponent {
  kpiMetrics = [
    { icon: '💰', value: '$45,230', label: 'Monthly Revenue', change: '+12%', trend: 'positive' },
    { icon: '👥', value: '2,847', label: 'Active Users', change: '+8%', trend: 'positive' },
    { icon: '📈', value: '23.5%', label: 'Conversion Rate', change: '-2%', trend: 'negative' },
    { icon: '⏱️', value: '2.4m', label: 'Avg. Session Time', change: '+15%', trend: 'positive' }
  ];
  
  chartData = [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 78 },
    { label: 'Wed', value: 90 },
    { label: 'Thu', value: 85 },
    { label: 'Fri', value: 95 },
    { label: 'Sat', value: 70 },
    { label: 'Sun', value: 60 }
  ];
  
  aiInsights = [
    {
      icon: '📈',
      type: 'positive',
      title: 'Revenue Growth Opportunity',
      description: 'Customer segment A shows 25% higher lifetime value. Consider targeted campaigns.',
      confidence: 87
    },
    {
      icon: '⚠️',
      type: 'warning',
      title: 'Inventory Alert',
      description: 'Predicted stockout for top-selling items in 5 days based on current trends.',
      confidence: 92
    },
    {
      icon: 'ℹ️',
      type: 'info',
      title: 'Seasonal Pattern',
      description: 'Sales typically increase 15% in the next 2 weeks based on historical data.',
      confidence: 78
    }
  ];
  
  reports = [
    {
      icon: '📊',
      title: 'Monthly Performance Report',
      description: 'Comprehensive analysis of business metrics and KPIs',
      date: '2 hours ago'
    },
    {
      icon: '👥',
      title: 'Employee Productivity Report',
      description: 'Timesheet analysis and productivity insights',
      date: '1 day ago'
    },
    {
      icon: '📦',
      title: 'Inventory Status Report',
      description: 'Current stock levels and reorder recommendations',
      date: '3 days ago'
    }
  ];
}