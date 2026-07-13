# Playwright Automation Testing Project

A comprehensive end-to-end testing framework built with Playwright for web application automation testing.

## 🚀 Project Overview

This project provides a robust automation testing solution using Playwright, featuring:
- **Page Object Model (POM)** design pattern
- **Data-driven testing** with JSON test data files
- **Cross-browser testing** support
- **Comprehensive test scenarios** covering various UI interactions
- **CI/CD integration** ready
- **Detailed reporting** and screenshots

## 📁 Project Structure

```
├── tests/                    # Test specifications
│   ├── CreateAccount.spec.js
│   ├── DatePicker.spec.js
│   ├── DialogBox.spec.js
│   ├── DropDown.spec.js
│   ├── DynamicButton.spec.js
│   ├── Login.spec.js
│   ├── Pagination.spec.js
│   ├── PaymentFlow.spec.js
│   └── TabSwitch.spec.js
├── pages/                    # Page Object Models
│   ├── homePage.js
│   └── createAccountPage.js
├── testdata/                 # Test data files
│   ├── datePicker.json
│   ├── e2eTestData.json
│   ├── login.json
│   └── PaymentFlow.json
├── utils/                    # Utility functions
│   └── dataProvider.js
├── reports/                  # Test reports
├── screenshots/              # Test screenshots
├── playwright.config.js      # Playwright configuration
└── package.json
```

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playwright-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

## 🎯 Available Test Scenarios

The project includes comprehensive test scenarios for:

- **Authentication**
  - Login functionality
  - Account creation

- **UI Components**
  - Date picker interactions
  - Dropdown selections
  - Dialog box handling
  - Dynamic button interactions
  - Tab switching
  - Pagination

- **Business Flows**
  - Payment flow testing
  - End-to-end user journeys

## 🏃‍♂️ Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug
```

### Environment-Specific Testing

```bash
# Run tests with QA environment
npm run test:qa

# Run tests with staging environment
npm run test:stage

# Run tests with production environment
npm run test:prod
```

### Targeted Test Execution

```bash
# Run specific test suites
npm run test:login
npm run test:login-suite
npm run test:all-swiggy

# Run tests by category
npm run test:smoke
npm run test:regression
```

## 🔧 Configuration

### Playwright Configuration

The project uses `playwright.config.js` with the following key settings:

- **Test timeout**: 60 seconds
- **Expect timeout**: 5 seconds
- **Parallel execution**: Enabled
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: Retained on failure
- **Browser**: Chromium (configurable for Firefox/WebKit)

### Environment Variables

Create environment-specific `.env` files:
- `.env` - Production environment
- `.env.qa` - QA environment
- `.env.stage` - Staging environment

## 📊 Test Reports

After test execution, reports are generated in the `reports/` directory:

- **HTML Reports**: Interactive test reports with detailed results
- **Screenshots**: Captured on test failures
- **Videos**: Recorded test sessions

## 🏗️ Project Architecture

### Page Object Model (POM)

The project follows the Page Object Model pattern:

```javascript
// Example: pages/homePage.js
class HomePage {
  constructor(page, testData) {
    this.page = page;
    this.testData = testData;
  }

  async navigateToHomePage() {
    // Navigation logic
  }

  async login() {
    // Login logic
  }
}
```

### Data-Driven Testing

Test data is externalized in JSON files:

```javascript
// Example: testdata/login.json
[
  {
    "testName": "Valid Login",
    "username": "testuser",
    "password": "testpass"
  }
]
```

### Test Structure

Tests are organized using Playwright's test framework:

```javascript
// Example: tests/Login.spec.js
const { test } = require('@playwright/test');
import { getTestData } from '../utils/dataProvider';

const testData = getTestData("testdata/login.json");

for (const testcase of testData) {
  test(`${testcase.testName}`, async ({ page }) => {
    // Test implementation
  });
}
```

## 🧹 Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Best Practices

- **Page Objects**: Use POM for better maintainability
- **Test Data**: Externalize test data in JSON files
- **Selectors**: Use reliable selectors (data-testid, aria-label)
- **Assertions**: Use meaningful assertions with clear error messages
- **Documentation**: Keep test descriptions clear and descriptive

## 🐛 Troubleshooting

### Common Issues

1. **Browser not found**: Run `npx playwright install`
2. **Test timeouts**: Check network connectivity and increase timeout in config
3. **Element not found**: Verify selectors and page load timing

### Debug Mode

Use debug mode for troubleshooting:

```bash
npm run test:debug
```

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For questions and support, please contact the development team or create an issue in the repository. 