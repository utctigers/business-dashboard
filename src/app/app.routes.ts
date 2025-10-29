import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeesComponent } from './employees/employees.component';
import { TimesheetsComponent } from './timesheets/timesheets.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { CalendarComponent } from './calendar/calendar.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'timesheets', component: TimesheetsComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'analytics', component: AnalyticsComponent }
];