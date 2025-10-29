import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="calendar" class="calendar">
      <h1 id="calendarTitle">Calendar & Jobs</h1>
      
      <div id="calendarGrid" class="calendar-grid">
        <div id="calendarView" class="calendar-view">
          <div id="calendarHeader" class="calendar-header">
            <button id="prevMonthBtn" (click)="previousMonth()">&lt;</button>
            <h3 id="currentMonth">{{ currentMonth }} {{ currentYear }}</h3>
            <button id="nextMonthBtn" (click)="nextMonth()">&gt;</button>
          </div>
          
          <div id="calendarDays" class="calendar-days">
            <div class="day-header" *ngFor="let day of weekDays">{{ day }}</div>
            <div 
              id="calendarDay{{ i }}"
              class="calendar-day" 
              *ngFor="let day of calendarDays; let i = index" 
              [class.other-month]="!day.currentMonth"
              [class.today]="day.isToday"
              [class.has-jobs]="day.jobs.length > 0">
              <span class="day-number">{{ day.date }}</span>
              <div class="job-indicator" *ngIf="day.jobs.length > 0">{{ day.jobs.length }}</div>
            </div>
          </div>
        </div>
        
        <div id="jobsPanel" class="jobs-panel">
          <h3 id="jobsPanelTitle">Upcoming Jobs</h3>
          <div id="jobList" class="job-list">
            <div id="jobItem{{ i }}" class="job-item" *ngFor="let job of upcomingJobs; let i = index" [class]="job.priority">
              <div class="job-date">{{ job.date | date:'MMM dd' }}</div>
              <div class="job-content">
                <div class="job-title">{{ job.title }}</div>
                <div class="job-client">{{ job.client }}</div>
                <div class="job-time">{{ job.time }}</div>
              </div>
              <div class="job-status">{{ job.status }}</div>
            </div>
          </div>
          
          <button id="addJobBtn" class="btn-primary" (click)="openAddJobForm()">Add Job</button>
        </div>
      </div>
    </div>
    
    <div class="modal" *ngIf="showJobForm" (click)="showJobForm = false">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h4>Add New Job</h4>
          <button class="close" (click)="showJobForm = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="jobTitle">Job Title</label>
            <input id="jobTitle" type="text" [value]="newJob.title" (input)="newJob.title = $any($event.target).value">
          </div>
          <div class="form-group">
            <label for="jobClient">Client</label>
            <input id="jobClient" type="text" [value]="newJob.client" (input)="newJob.client = $any($event.target).value">
          </div>
          <div class="form-group">
            <label for="jobDate">Date</label>
            <input id="jobDate" type="date" [value]="newJob.date" (input)="newJob.date = $any($event.target).value">
          </div>
          <div class="form-group">
            <label for="jobTime">Time</label>
            <input id="jobTime" type="time" [value]="newJob.time" (input)="newJob.time = $any($event.target).value">
          </div>
          <div class="form-group">
            <label for="jobPriority">Priority</label>
            <select id="jobPriority" [value]="newJob.priority" (change)="newJob.priority = $any($event.target).value">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button id="saveJobBtn" class="btn-primary" (click)="saveJob()">Add Job</button>
          <button id="cancelJobBtn" class="btn-secondary" (click)="showJobForm = false">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar h1 { color: #2d3748; margin-bottom: 2rem; }
    .calendar-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
    .calendar-view { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .calendar-header button { background: #667eea; color: white; border: none; border-radius: 6px; padding: 0.5rem 1rem; cursor: pointer; }
    .calendar-header h3 { margin: 0; color: #2d3748; }
    .calendar-days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #f0f0f0; }
    .day-header { background: #f8f9fa; padding: 0.75rem; text-align: center; font-weight: 600; color: #666; }
    .calendar-day { background: white; padding: 0.75rem; min-height: 80px; cursor: pointer; position: relative; }
    .calendar-day:hover { background: #f8f9fa; }
    .calendar-day.other-month { color: #ccc; }
    .calendar-day.today { background: #e6f3ff; border: 2px solid #667eea; }
    .calendar-day.has-jobs { background: #fff5f5; }
    .day-number { font-weight: 500; }
    .job-indicator { position: absolute; top: 0.25rem; right: 0.25rem; background: #667eea; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; }
    .jobs-panel { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .jobs-panel h3 { margin-bottom: 1rem; color: #2d3748; }
    .job-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 1px solid #f0f0f0; border-radius: 8px; margin-bottom: 0.75rem; }
    .job-item.high { border-left: 4px solid #ef4444; }
    .job-item.medium { border-left: 4px solid #f59e0b; }
    .job-item.low { border-left: 4px solid #10b981; }
    .job-date { font-weight: 600; color: #667eea; min-width: 60px; }
    .job-content { flex: 1; }
    .job-title { font-weight: 500; color: #2d3748; }
    .job-client { font-size: 0.875rem; color: #666; }
    .job-time { font-size: 0.875rem; color: #666; }
    .job-status { font-size: 0.875rem; padding: 0.25rem 0.75rem; border-radius: 12px; background: #f0f9ff; color: #0369a1; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; padding: 0.75rem 1.5rem; cursor: pointer; font-weight: 500; width: 100%; margin-top: 1rem; }
    .btn-secondary { background: white; color: #667eea; border: 2px solid #667eea; border-radius: 8px; padding: 0.75rem 1.5rem; cursor: pointer; font-weight: 500; }
    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-dialog { background: white; border-radius: 8px; width: 500px; max-width: 90%; }
    .modal-header { padding: 1rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h4 { margin: 0; }
    .close { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
    .modal-body { padding: 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #2d3748; }
    .modal-body input, .modal-body select { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.875rem; }
    .modal-body input:focus, .modal-body select:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
    .modal-footer { padding: 1rem; border-top: 1px solid #eee; text-align: right; }
    .modal-footer button { margin-left: 0.5rem; width: auto; }
  `]
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  currentMonth = '';
  currentYear = 0;
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: any[] = [];
  upcomingJobs: any[] = [];
  showJobForm = false;
  newJob: any = {
    title: '',
    client: '',
    date: '',
    time: '',
    priority: 'medium'
  };

  ngOnInit() {
    this.updateCalendar();
    this.loadUpcomingJobs();
  }

  updateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    this.currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });
    this.currentYear = year;
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    this.calendarDays = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      this.calendarDays.push({
        date: date.getDate(),
        fullDate: new Date(date),
        currentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        jobs: this.getJobsForDate(date)
      });
    }
  }

  getJobsForDate(date: Date): any[] {
    return this.upcomingJobs.filter(job => 
      new Date(job.date).toDateString() === date.toDateString()
    );
  }

  loadUpcomingJobs() {
    const today = new Date();
    this.upcomingJobs = [
      { id: 1, title: 'Website Redesign', client: 'ABC Corp', date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), time: '9:00 AM', status: 'In Progress', priority: 'high' },
      { id: 2, title: 'Database Migration', client: 'XYZ Ltd', date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), time: '2:00 PM', status: 'Scheduled', priority: 'medium' },
      { id: 3, title: 'Security Audit', client: 'Tech Solutions', date: new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000), time: '10:00 AM', status: 'Pending', priority: 'high' },
      { id: 4, title: 'Training Session', client: 'Internal', date: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000), time: '3:00 PM', status: 'Confirmed', priority: 'low' }
    ];
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateCalendar();
  }

  openAddJobForm() {
    this.showJobForm = true;
    this.resetJobForm();
  }

  saveJob() {
    const newJobData = {
      id: Date.now(),
      title: this.newJob.title,
      client: this.newJob.client,
      date: new Date(this.newJob.date),
      time: this.formatTime(this.newJob.time),
      status: 'Scheduled',
      priority: this.newJob.priority
    };
    
    this.upcomingJobs.push(newJobData);
    this.upcomingJobs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.updateCalendar();
    this.showJobForm = false;
    this.resetJobForm();
  }

  private formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  private resetJobForm() {
    this.newJob = {
      title: '',
      client: '',
      date: '',
      time: '',
      priority: 'medium'
    };
  }
}