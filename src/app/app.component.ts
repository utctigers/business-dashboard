import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { ChatbotComponent } from './chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ChatbotComponent],
  template: `
    <div class="app-container">
      <header class="header">
        <div class="header-content">
          <div class="logo">
            <h1>📊 Business Dashboard</h1>
            <span class="subtitle">Powered by Demori AI</span>
          </div>
          <nav class="nav">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
            <a routerLink="/employees" routerLinkActive="active" class="nav-link">Employees</a>
            <a routerLink="/timesheets" routerLinkActive="active" class="nav-link">Timesheets</a>
            <a routerLink="/inventory" routerLinkActive="active" class="nav-link">Inventory</a>
            <a routerLink="/calendar" routerLinkActive="active" class="nav-link">Calendar</a>
            <a *ngIf="showAnalytics" routerLink="/analytics" routerLinkActive="active" class="nav-link">Analytics</a>
          </nav>
        </div>
      </header>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <app-chatbot></app-chatbot>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f5f7fa;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .subtitle {
      font-size: 0.875rem;
      opacity: 0.8;
    }
    
    .nav {
      display: flex;
      gap: 2rem;
    }
    
    .nav-link {
      color: white;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.3s ease;
    }
    
    .nav-link:hover,
    .nav-link.active {
      background: rgba(255,255,255,0.2);
    }
    
    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
  `]
})
export class AppComponent {
  showAnalytics = environment.showAnalytics;
}