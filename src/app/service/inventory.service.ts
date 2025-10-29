import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private inventorySubject = new BehaviorSubject<any[]>([]);
  inventory$ = this.inventorySubject.asObservable();

  constructor(private db: DatabaseService) {
    this.loadInventory();
  }

  async loadInventory() {
    try {
      console.log('🔄 Loading inventory from database/API');
      const inventory = await this.db.query('SELECT * FROM inventory ORDER BY id');
      console.log('✅ Inventory loaded:', inventory.length, 'items');
      this.inventorySubject.next(inventory);
    } catch (error) {
      console.error('❌ Failed to load inventory:', error);
    }
  }

  getInventory() {
    return this.inventorySubject.value;
  }

  async addItem(item: any) {
    console.log('Adding inventory item to Aurora DSQL:', item);
    const result = await this.db.query(
      'INSERT INTO inventory (name, sku, category, stock, min_stock, max_stock, price) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [item]
    );
    console.log('Insert result:', result);
    this.loadInventory();
  }

  async updateItem(id: number, item: any) {
    console.log('Updating inventory item in Aurora DSQL:', id, item);
    const result = await this.db.query(
      'UPDATE inventory SET name = ?, sku = ?, category = ?, stock = ?, min_stock = ?, max_stock = ?, price = ? WHERE id = ?', 
      [item, id]
    );
    console.log('Update result:', result);
    this.loadInventory();
  }

  async removeItem(id: number) {
    console.log('Removing inventory item from Aurora DSQL:', id);
    const result = await this.db.query('DELETE FROM inventory WHERE id = ?', [id]);
    console.log('Delete result:', result);
    this.loadInventory();
  }

  async reorderItem(id: number, maxStock: number) {
    console.log('Reordering inventory item:', id, 'to max stock:', maxStock);
    const result = await this.db.query('UPDATE inventory SET stock = ? WHERE id = ?', [{ maxStock }, id]);
    console.log('Reorder result:', result);
    this.loadInventory();
  }

  getLowStockCount() {
    return this.inventorySubject.value.filter(item => item.stock <= item.min_stock).length;
  }

  getTotalValue() {
    return this.inventorySubject.value.reduce((sum, item) => sum + (item.stock * (item.price || 0)), 0);
  }
}