# Playwright Tests for Business Dashboard

End-to-end tests using Playwright with Page Object Model (POM) pattern.

## Structure

```
tests/
├── pages/           # Page Object Model classes
│   ├── BasePage.js     # Base page with common methods
│   ├── DashboardPage.js
│   ├── EmployeesPage.js
│   ├── InventoryPage.js
│   ├── CalendarPage.js
│   └── TimesheetsPage.js
└── specs/           # Test specifications
    ├── dashboard.spec.js
    ├── employees.spec.js
    ├── inventory.spec.js
    ├── calendar.spec.js
    └── navigation.spec.js
```

## Setup

1. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Install Playwright Browsers**:
   ```bash
   npx playwright install
   ```

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run tests with browser visible
npm run test:e2e:headed

# Run tests with UI mode
npm run test:e2e:ui

# Run specific test file
npx playwright test dashboard.spec.js

# Run tests in specific browser
npx playwright test --project=chromium
```

## Page Object Model

Each page has its own class with:
- **Selectors** - Element locators organized in objects
- **Methods** - Page-specific actions and assertions
- **Navigation** - Methods to navigate to the page

### Example Usage

```javascript
const { test, expect } = require('@playwright/test');
const DashboardPage = require('../pages/DashboardPage');

test('dashboard test', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.navigateToDashboard();
  
  const title = await dashboardPage.getPageTitle();
  expect(title).toBe('Business Overview');
});
```

## Test Coverage

- **Dashboard**: Metrics, navigation, quick actions
- **Employees**: CRUD operations, modal interactions
- **Inventory**: Item management, report generation
- **Calendar**: Job scheduling, month navigation
- **Navigation**: Menu functionality, routing
- **Timesheets**: Time tracking, form validation

## Configuration

- **Base URL**: http://localhost:4201
- **Browsers**: Chromium, Firefox, WebKit
- **Timeout**: 30s for tests, 5s for assertions
- **Reports**: HTML report generated in `playwright-report/`
- **Screenshots**: Captured on failure
- **Traces**: Recorded on first retry

## Best Practices

1. **Use Page Objects** - Keep selectors and methods organized
2. **Wait for Elements** - Use proper waiting strategies
3. **Descriptive Tests** - Clear test names and assertions
4. **Independent Tests** - Each test should be self-contained
5. **Clean Selectors** - Use stable, semantic selectors