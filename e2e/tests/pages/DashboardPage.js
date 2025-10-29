const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      pageTitle: '#dashboardTitle',
      metricCards: '[id^="metricCard"]',
      employeesMetric: '#metricCard0',
      inventoryMetric: '#metricCard1',
      revenueMetric: '#metricCard2',
      hoursMetric: '#metricCard3',
      recentActivity: '#activityList',
      quickActions: '#actionsGrid',
      addEmployeeAction: '#quickAction0'
    };
  }

  async navigateToDashboard() {
    await this.navigate('/dashboard');
    await this.waitForNavigation();
  }

  async getPageTitle() {
    return await this.getText(this.selectors.pageTitle);
  }

  async getMetricCards() {
    await this.waitForElement(this.selectors.metricCards);
    return await this.page.locator(this.selectors.metricCards);
  }

  async getEmployeesCount() {
    const metric = this.page.locator(this.selectors.employeesMetric);
    return await metric.locator('h3').textContent();
  }

  async clickQuickAction(actionText) {
    await this.click(`button:has-text("${actionText}")`);
  }

  async isRecentActivityVisible() {
    return await this.isVisible(this.selectors.recentActivity);
  }
}

module.exports = DashboardPage;