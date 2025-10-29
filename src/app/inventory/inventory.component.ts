import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../service/inventory.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inventory">
      <div class="header">
        <h1>Inventory Management</h1>
        <div class="header-actions">
          <button class="btn-secondary" (click)="openAddForm()">Add Item</button>
          <div class="report-dropdown">
            <button class="btn-primary" (click)="toggleReportDropdown()">Generate Report ▼</button>
            <div class="dropdown-menu" *ngIf="showReportDropdown">
              <button (click)="generateExpenseReport('weekly')">Weekly Report</button>
              <button (click)="generateExpenseReport('monthly')">Monthly Report</button>
              <button (click)="generateExpenseReport('quarterly')">Quarterly Report</button>
              <button (click)="generateExpenseReport('yearly')">Yearly Report</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="inventory-stats">
        <div class="stat-card" *ngFor="let stat of inventoryStats">
          <div class="stat-icon" [style.background]="stat.color">{{ stat.icon }}</div>
          <div class="stat-content">
            <h3>{{ stat.value }}</h3>
            <p>{{ stat.label }}</p>
          </div>
        </div>
      </div>
      
      <div class="inventory-grid">
        <div class="inventory-table">
          <h3>Current Inventory</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of inventoryItems">
                <td>
                  <div class="item-info">
                    <div class="item-image">{{ item.name?.charAt(0) || 'I' }}</div>
                    <div>
                      <div class="item-name">{{ item.name }}</div>
                      <div class="item-sku">SKU: {{ item.sku }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ item.category }}</td>
                <td>{{ item.stock }}</td>
                <td>
                  <span class="status" [class]="getStatusClass(item.stock, item.min_stock)">
                    {{ getStatusText(item.stock, item.min_stock) }}
                  </span>
                </td>
                <td>
                  <button class="btn-small" (click)="editItem(item)">Edit</button>
                  <button class="btn-small" (click)="reorderItem(item)">Reorder</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      
    </div>
    
    <div class="modal" *ngIf="showForm" (click)="showForm = false">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h4>{{ isEditing ? 'Edit' : 'Add' }} Item</h4>
          <button class="close" (click)="showForm = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="itemName">Item Name</label>
            <input id="itemName" type="text" [value]="currentItem.name" (input)="currentItem.name = $any($event.target).value">
          </div>
          <div class="form-group">
            <label for="itemSku">SKU</label>
            <input id="itemSku" type="text" [value]="currentItem.sku" (input)="currentItem.sku = $any($event.target).value">
          </div>
          <div class="form-group">
            <label for="itemCategory">Category</label>
            <select id="itemCategory" [value]="currentItem.category" (change)="currentItem.category = $any($event.target).value">
              <option value="">Select Category</option>
              <option value="Furniture">Furniture</option>
              <option value="Electronics">Electronics</option>
              <option value="Supplies">Supplies</option>
              <option value="Food">Food</option>
            </select>
          </div>
          <div class="form-group">
            <label for="itemStock">Current Stock</label>
            <input id="itemStock" type="number" [value]="currentItem.stock" (input)="currentItem.stock = +$any($event.target).value">
          </div>
          <div class="form-group">
            <label for="itemMinStock">Minimum Stock Level</label>
            <input id="itemMinStock" type="number" [value]="currentItem.min_stock" (input)="currentItem.min_stock = +$any($event.target).value">
          </div>
          <div class="form-group">
            <label for="itemMaxStock">Maximum Stock Level</label>
            <input id="itemMaxStock" type="number" [value]="currentItem.max_stock" (input)="currentItem.max_stock = +$any($event.target).value">
          </div>
          <div class="form-group">
            <label for="itemPrice">Price ($)</label>
            <input id="itemPrice" type="number" [value]="currentItem.price" (input)="currentItem.price = +$any($event.target).value" step="0.01">
          </div>
        </div>
        <div class="modal-footer">
          <button id="saveItemBtn" class="btn-primary" (click)="saveItem()">{{ isEditing ? 'Update' : 'Add' }}</button>
          <button id="cancelItemBtn" class="btn-secondary" (click)="showForm = false">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inventory h1 { color: #2d3748; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .header-actions { display: flex; gap: 1rem; }
    .btn-primary, .btn-secondary { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; }
    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .btn-secondary { background: white; color: #667eea; border: 2px solid #667eea; }
    .inventory-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .stat-card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 1rem; }
    .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: white; }
    .stat-content h3 { font-size: 1.75rem; font-weight: 700; margin: 0; color: #2d3748; }
    .stat-content p { margin: 0.25rem 0 0 0; color: #666; }
    .inventory-table { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .inventory-table h3 { margin-bottom: 1rem; color: #2d3748; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #f0f0f0; }
    th { background: #f8f9fa; font-weight: 600; color: #2d3748; }
    .item-info { display: flex; align-items: center; gap: 0.75rem; }
    .item-image { width: 40px; height: 40px; border-radius: 8px; background: #667eea; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }
    .item-name { font-weight: 500; color: #2d3748; }
    .item-sku { font-size: 0.875rem; color: #666; }
    .status { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; font-weight: 500; }
    .status.in-stock { background: #dcfce7; color: #166534; }
    .status.low-stock { background: #fef3c7; color: #92400e; }
    .status.out-of-stock { background: #fee2e2; color: #dc2626; }
    .btn-small { padding: 0.25rem 0.75rem; border: 1px solid #e2e8f0; background: white; border-radius: 4px; cursor: pointer; font-size: 0.875rem; }
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
    .modal-footer button { margin-left: 0.5rem; }
    .report-dropdown { position: relative; }
    .dropdown-menu { position: absolute; top: 100%; right: 0; background: white; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 100; min-width: 150px; }
    .dropdown-menu button { display: block; width: 100%; padding: 0.75rem 1rem; border: none; background: none; text-align: left; cursor: pointer; font-size: 0.875rem; }
    .dropdown-menu button:hover { background: #f8f9fa; }
  `]
})
export class InventoryComponent implements OnInit {
  inventoryItems: any[] = [];
  inventoryStats: any[] = [];
  showForm = false;
  isEditing = false;
  showReportDropdown = false;
  currentItem: any = {
    id: null,
    name: '',
    sku: '',
    category: '',
    stock: 0,
    min_stock: 0,
    max_stock: 0,
    price: 0
  };
  
  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.loadInventory();
    this.inventoryService.inventory$.subscribe((items: any[]) => {
      this.inventoryItems = items;
      this.updateStats();
    });
  }

  async loadInventory() {
    await this.inventoryService.loadInventory();
  }

  updateStats() {
    const items = this.inventoryItems;
    const lowStockCount = this.inventoryService.getLowStockCount();
    const totalValue = this.inventoryService.getTotalValue();
    
    this.inventoryStats = [
      { icon: '📦', value: items.length.toString(), label: 'Total Items', color: '#667eea' },
      { icon: '⚠️', value: lowStockCount.toString(), label: 'Low Stock Items', color: '#f59e0b' },
      { icon: '💰', value: `$${totalValue.toLocaleString()}`, label: 'Total Value', color: '#10b981' },
      { icon: '📈', value: '23', label: 'Items Restocked', color: '#8b5cf6' }
    ];
  }
  
  getStatusClass(stock: number, minStock: number): string {
    if (stock === 0) return 'out-of-stock';
    if (stock <= minStock) return 'low-stock';
    return 'in-stock';
  }
  
  getStatusText(stock: number, minStock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock <= minStock) return 'Low Stock';
    return 'In Stock';
  }

  editItem(item: any) {
    this.isEditing = true;
    this.currentItem = { ...item };
    this.showForm = true;
  }

  async saveItem() {
    try {
      if (this.isEditing && this.currentItem.id) {
        await this.inventoryService.updateItem(this.currentItem.id, this.currentItem);
      } else {
        await this.inventoryService.addItem(this.currentItem);
      }
      this.showForm = false;
      this.resetForm();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  }

  openAddForm() {
    this.showForm = true;
    this.isEditing = false;
    this.resetForm();
  }

  async reorderItem(item: any) {
    try {
      await this.inventoryService.reorderItem(item.id, item.max_stock);
    } catch (error) {
      console.error('Error reordering item:', error);
    }
  }

  resetForm() {
    this.currentItem = {
      id: null,
      name: '',
      sku: '',
      category: '',
      stock: 0,
      min_stock: 0,
      max_stock: 0,
      price: 0
    };
  }

  toggleReportDropdown() {
    this.showReportDropdown = !this.showReportDropdown;
  }

  generateExpenseReport(period: 'weekly' | 'monthly' | 'quarterly' | 'yearly') {
    this.showReportDropdown = false;
    const reportData = this.generateReportData(period);
    this.downloadReport(reportData, period);
  }

  private generateReportData(period: string) {
    const now = new Date();
    const totalValue = this.inventoryService.getTotalValue();
    const lowStockItems = this.inventoryItems.filter(item => item.stock <= item.min_stock);
    
    return {
      period: period.charAt(0).toUpperCase() + period.slice(1),
      generatedDate: now.toLocaleDateString(),
      totalItems: this.inventoryItems.length,
      totalValue: totalValue,
      lowStockItems: lowStockItems.length,
      categories: this.getCategoryBreakdown(),
      items: this.inventoryItems
    };
  }

  private getCategoryBreakdown() {
    const breakdown: any = {};
    this.inventoryItems.forEach(item => {
      if (!breakdown[item.category]) {
        breakdown[item.category] = { count: 0, value: 0 };
      }
      breakdown[item.category].count++;
      breakdown[item.category].value += item.price * item.stock;
    });
    return breakdown;
  }

  private downloadReport(data: any, period: string) {
    const csvContent = this.generateCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-expense-report-${period}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private generateCSV(data: any): string {
    let csv = `Inventory Expense Report - ${data.period}\n`;
    csv += `Generated: ${data.generatedDate}\n\n`;
    csv += `Summary\n`;
    csv += `Total Items,${data.totalItems}\n`;
    csv += `Total Value,$${data.totalValue.toLocaleString()}\n`;
    csv += `Low Stock Items,${data.lowStockItems}\n\n`;
    
    csv += `Category Breakdown\n`;
    csv += `Category,Item Count,Total Value\n`;
    Object.entries(data.categories).forEach(([category, info]: [string, any]) => {
      csv += `${category},${info.count},$${info.value.toLocaleString()}\n`;
    });
    
    csv += `\nDetailed Inventory\n`;
    csv += `Item Name,SKU,Category,Stock,Min Stock,Max Stock,Unit Price,Total Value,Status\n`;
    data.items.forEach((item: any) => {
      const status = this.getStatusText(item.stock, item.min_stock);
      const totalValue = item.price * item.stock;
      csv += `${item.name},${item.sku},${item.category},${item.stock},${item.min_stock},${item.max_stock},$${item.price},$${totalValue.toLocaleString()},${status}\n`;
    });
    
    return csv;
  }
}