import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="chatbotContainer" class="chatbot-container">
      <div id="chatToggle" class="chat-toggle" (click)="toggleChat()" [class.active]="isOpen">
        <span class="chat-icon">💬</span>
      </div>
      
      <div id="chatWindow" class="chat-window" *ngIf="isOpen">
        <div id="chatHeader" class="chat-header">
          <h4>AI Assistant</h4>
          <button id="chatCloseBtn" class="close-btn" (click)="toggleChat()">&times;</button>
        </div>
        
        <div id="chatMessages" class="chat-messages" #messagesContainer>
          <div class="message bot-message">
            <div class="message-content">
              Hi! I'm your AI assistant. How can I help you with your business today?
            </div>
          </div>
          <div 
            class="message" 
            *ngFor="let message of messages" 
            [class.user-message]="message.type === 'user'"
            [class.bot-message]="message.type === 'bot'">
            <div class="message-content">{{ message.content }}</div>
          </div>
        </div>
        
        <div id="chatInput" class="chat-input">
          <input 
            id="chatMessageInput"
            type="text" 
            placeholder="Type your message..." 
            [value]="currentMessage"
            (input)="currentMessage = $any($event.target).value"
            (keyup.enter)="sendMessage()"
            #messageInput>
          <button id="chatSendBtn" (click)="sendMessage()" [disabled]="!currentMessage.trim()">Send</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chatbot-container { position: fixed; bottom: 20px; right: 20px; z-index: 1000; }
    .chat-toggle { width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s ease; }
    .chat-toggle:hover { transform: scale(1.1); }
    .chat-toggle.active { background: #ef4444; }
    .chat-icon { font-size: 1.5rem; color: white; }
    .chat-window { position: absolute; bottom: 80px; right: 0; width: 350px; height: 500px; background: white; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); display: flex; flex-direction: column; }
    .chat-header { padding: 1rem; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px 12px 0 0; }
    .chat-header h4 { margin: 0; font-size: 1rem; }
    .close-btn { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }
    .chat-messages { flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
    .message { max-width: 80%; }
    .user-message { align-self: flex-end; }
    .bot-message { align-self: flex-start; }
    .message-content { padding: 0.75rem 1rem; border-radius: 18px; font-size: 0.875rem; line-height: 1.4; }
    .user-message .message-content { background: #667eea; color: white; }
    .bot-message .message-content { background: #f1f3f4; color: #2d3748; }
    .chat-input { padding: 1rem; border-top: 1px solid #f0f0f0; display: flex; gap: 0.5rem; }
    .chat-input input { flex: 1; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 20px; outline: none; font-size: 0.875rem; }
    .chat-input input:focus { border-color: #667eea; }
    .chat-input button { padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 20px; cursor: pointer; font-size: 0.875rem; font-weight: 500; }
    .chat-input button:disabled { background: #ccc; cursor: not-allowed; }
  `]
})
export class ChatbotComponent {
  isOpen = false;
  currentMessage = '';
  messages: any[] = [];

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  async sendMessage() {
    if (!this.currentMessage.trim()) return;

    const userMessage = this.currentMessage.trim();
    this.messages.push({ type: 'user', content: userMessage });
    this.currentMessage = '';

    // Simulate bot response
    setTimeout(() => {
      const botResponse = this.generateBotResponse(userMessage);
      this.messages.push({ type: 'bot', content: botResponse });
    }, 1000);
  }

  private generateBotResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
      return "I can help you with inventory management! You can check stock levels, add new items, or generate inventory reports from the Inventory tab.";
    }
    
    if (lowerMessage.includes('employee') || lowerMessage.includes('staff')) {
      return "For employee management, visit the Employees tab where you can add new staff, update information, and track employee details.";
    }
    
    if (lowerMessage.includes('timesheet') || lowerMessage.includes('hours')) {
      return "You can manage timesheets and track work hours in the Timesheets section. This helps monitor productivity and payroll.";
    }
    
    if (lowerMessage.includes('calendar') || lowerMessage.includes('schedule')) {
      return "The Calendar tab shows your upcoming jobs and appointments. You can add new jobs and track your schedule there.";
    }
    
    if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
      return "I can help you generate various reports! Try the Inventory section for expense reports, or check the Analytics tab for business insights.";
    }
    
    return "I'm here to help you navigate your business dashboard. You can ask me about inventory, employees, timesheets, calendar, or reports!";
  }
}