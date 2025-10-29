const BasePage = require('./BasePage');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      pageTitle: 'h1:has-text("Inventory")',
      addItemBtn: 'button:has-text("Add Item")',
      generateReportBtn: 'button:has-text("Generate Report")',
      reportDropdown: '.report-dropdown',
      dropdownMenu: '.dropdown-menu',
      inventoryTable: 'table',
      inventoryRows: 'tbody tr',
      statCards: '.stat-card',
      modal: '.modal',
      itemNameInput: '#itemName',
      itemSkuInput: '#itemSku',
      categorySelect: '#itemCategory',
      stockInput: '#itemStock',
      minStockInput: '#itemMinStock',
      maxStockInput: '#itemMaxStock',
      priceInput: '#itemPrice',
      saveBtn: '#saveItemBtn',
      cancelBtn: '#cancelItemBtn'
    };
  }

  async navigateToInventory() {
    await this.navigate('/inventory');
    await this.waitForNavigation();
  }

  async clickAddItem() {
    await this.click(this.selectors.addItemBtn);
    await this.waitForElement(this.selectors.modal);
  }

  async fillItemForm(name, sku, category, stock, minStock, maxStock, price) {
    await this.fill(this.selectors.itemNameInput, name);
    await this.fill(this.selectors.itemSkuInput, sku);
    await this.page.selectOption(this.selectors.categorySelect, category);
    await this.fill(this.selectors.stockInput, stock.toString());
    await this.fill(this.selectors.minStockInput, minStock.toString());
    await this.fill(this.selectors.maxStockInput, maxStock.toString());
    await this.fill(this.selectors.priceInput, price.toString());
  }

  async saveItem() {
    await this.click(this.selectors.saveBtn);
    await this.page.waitForSelector(this.selectors.modal, { state: 'hidden' });
  }

  async clickGenerateReport() {
    await this.click(this.selectors.generateReportBtn);
    await this.waitForElement(this.selectors.dropdownMenu);
  }

  async selectReportType(period) {
    await this.click(`button:has-text("${period} Report")`);
   // await this.click(`button:has-text("${fileType}")`);
  }

  async getInventoryStats() {
    await this.waitForElement(this.selectors.statCards);
    const cards = await this.page.locator(this.selectors.statCards);
    const count = await cards.count();
    const stats = [];
    
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const value = await card.locator('h3').textContent();
      const label = await card.locator('p').textContent();
      stats.push({ value, label });
    }
    
    return stats;
  }

  async getItemCount() {
    await this.waitForElement(this.selectors.inventoryTable);
    const rows = await this.page.locator(this.selectors.inventoryRows);
    return await rows.count();
  }

  async isItemInTable(itemName) {
    await this.waitForElement(this.selectors.inventoryTable);
    const itemRow = this.page.locator(`tbody tr:has-text("${itemName}")`);
    return await itemRow.count() > 0;
  }
}

module.exports = InventoryPage;