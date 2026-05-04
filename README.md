# Betsson QA Technical Task

![CI](https://github.com/YOUR_USERNAME/betsson-qa-task/actions/workflows/playwright.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Playwright](https://img.shields.io/badge/Playwright-1.44-green?logo=playwright)
![License](https://img.shields.io/badge/license-MIT-blue)

End-to-end UI and API test framework built with **Playwright + TypeScript** for the Betsson QA technical assessment.

---

## 📋 What's Covered

### Part 1: UI Testing — [SauceDemo](https://www.saucedemo.com/)

| Feature       | Test Cases | Tags |
|---------------|-----------|------|
| Login         | Valid login, invalid password, locked user, empty fields (data-driven) | `@smoke` `@regression` |
| Shopping Cart | Add/remove items, badge count, full checkout flow, missing info validation | `@smoke` `@regression` |

### Part 2: API Testing — [Petstore](https://petstore.swagger.io/)

| Endpoint         | Method | Test Cases | Tags |
|------------------|--------|-----------|------|
| `/pet`           | POST   | Create valid pet, retrieve after create, optional fields, invalid payload | `@smoke` `@regression` |
| `/pet/{petId}`   | GET    | Existing pet, 404 for non-existent, invalid ID, full field validation | `@smoke` `@regression` |

---

## 🏗️ Architecture

```
betsson-qa-task/
├── tests/
│   ├── ui/                  # UI feature specs
│   │   ├── login.spec.ts
│   │   └── cart.spec.ts
│   └── api/                 # API contract specs
│       ├── addPet.spec.ts
│       └── getPet.spec.ts
├── pages/                   # Page Object Model
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── fixtures/                # Custom Playwright fixtures (DI)
│   └── index.ts
├── schemas/                 # Zod schemas for API response validation
│   └── petstore.schema.ts
├── utils/                   # Shared helpers
│   └── apiHelpers.ts
├── .github/workflows/       # CI/CD pipeline
│   └── playwright.yml
├── playwright.config.ts     # Multi-project config (UI + API)
├── ARCHITECTURE.md          # Detailed design decisions
└── .env.example             # Environment variable template
```

**Key architectural patterns:**
- **Page Object Model** — clean separation of locators and test logic
- **Custom Fixtures** — Playwright's DI system for zero-boilerplate setup
- **Zod Schema Validation** — runtime API response shape verification
- **Retry Logic** — two-layer retry (test-level + request-level) for resilience
- **Data-driven tests** — `test.each()` for parametric cases

→ See [ARCHITECTURE.md](./ARCHITECTURE.md) for full design rationale.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/betsson-qa-task.git
cd betsson-qa-task
npm install
npx playwright install --with-deps chromium
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env if needed (defaults work out of the box)
```

### Running Tests

```bash
# All tests
npm test

# UI tests only
npm run test:ui

# API tests only
npm run test:api

# Smoke tests (fast feedback)
npm run test:smoke

# Regression suite
npm run test:regression
```

### Viewing the Report

```bash
npm run report
```

---

## 🔄 CI/CD

Tests run automatically on every push and pull request via **GitHub Actions**.

The pipeline runs UI and API tests **in parallel**, then publishes the HTML report to **GitHub Pages**.

Report URL: `https://YOUR_USERNAME.github.io/betsson-qa-task/`

To use secrets in your fork, add these to **Settings → Secrets and variables → Actions**:
- `STANDARD_USER` — `standard_user`
- `TEST_PASSWORD` — `secret_sauce`
- `LOCKED_USER` — `locked_out_user`

---

## 🛠️ Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev/) | 1.44 | UI + API test runner |
| [TypeScript](https://www.typescriptlang.org/) | 5.4 | Type-safe test code |
| [Zod](https://zod.dev/) | 3.23 | API response schema validation |
| [ESLint](https://eslint.org/) | 9 | Code quality |
| [Prettier](https://prettier.io/) | 3.2 | Code formatting |
| [GitHub Actions](https://github.com/features/actions) | — | CI/CD pipeline |
