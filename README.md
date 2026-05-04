# Betsson QA Technical Task

![CI](https://github.com/RomanVeremeicik/betsson-qa-task/actions/workflows/playwright.yml/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Playwright](https://img.shields.io/badge/Playwright-1.44-green?logo=playwright)
![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)

End-to-end UI and API test framework built with **Playwright + TypeScript** for the Betsson QA technical assessment.

---

##  Test Coverage

### Part 1: UI — [SauceDemo](https://www.saucedemo.com/)

| Feature | Test Cases | Tags |
|---|---|---|
| Login | Valid login, invalid password, locked user, empty fields | `@smoke` `@regression` |
| Shopping Cart | Add/remove items, badge count, full checkout, validation | `@smoke` `@regression` |

### Part 2: API — [Petstore](https://petstore.swagger.io/)

| Endpoint | Method | Test Cases | Tags |
|---|---|---|---|
| `/pet` | POST | Create valid pet, retrieve after create, optional fields, invalid payload | `@smoke` `@regression` |
| `/pet/{petId}` | GET | Existing pet, 404, invalid ID, full field validation | `@smoke` `@regression` |

→ See [TEST-PLAN.md](./TEST-PLAN.md) for full test plan with preconditions and test data.

---

##  Architecture

```
betsson-qa-task/
├── tests/
│   ├── ui/                  # UI feature specs
│   └── api/                 # API contract specs
├── pages/                   # Page Object Model
├── fixtures/                # Custom Playwright fixtures (DI)
├── schemas/                 # Zod schemas for API response validation
├── utils/                   # Shared helpers (retry, builders)
├── .github/workflows/       # CI/CD pipeline
├── Dockerfile               # Docker support
├── docker-compose.yml       # Run tests in containers
├── playwright.config.ts
├── TEST-PLAN.md             # Full test plan
└── ARCHITECTURE.md          # Design decisions
```

**Key patterns:**
- **Page Object Model** — clean separation of locators and logic
- **Custom Fixtures** — Playwright DI for zero-boilerplate setup
- **Zod Schema Validation** — runtime API response verification
- **Retry Logic** — two-layer retry for resilience
- **Data-driven tests** — `test.each()` for parametric cases

→ See [ARCHITECTURE.md](./ARCHITECTURE.md) for full design rationale.

---

##  Getting Started

### Prerequisites
- Node.js 20+
- npm 9+

### Installation

```bash
git clone https://github.com/RomanVeremeicik/betsson-qa-task.git
cd betsson-qa-task
npm install --legacy-peer-deps
npx playwright install chromium
```

### Environment Setup

```bash
cp .env.example .env
```

### Running Tests

```bash
# All tests
npm test

# UI tests only
npm run test:ui

# API tests only
npm run test:api

# Smoke tests
npm run test:smoke

# Regression suite
npm run test:regression
```

### View Report

```bash
npx playwright show-report
```

---

## 🐳 Docker

```bash
# Run all tests in Docker
docker-compose run tests

# UI tests only
docker-compose run tests-ui

# API tests only
docker-compose run tests-api
```

---

##  CI/CD

Tests run automatically on every push via **GitHub Actions** with parallel UI and API jobs.

Report: `https://RomanVeremeicik.github.io/betsson-qa-task/`

---

##  Tech Stack

| Tool | Purpose |
|---|---|
| Playwright 1.44 | UI + API test runner |
| TypeScript 5.4 | Type-safe test code |
| Zod 3.23 | API response schema validation |
| Docker | Containerized test execution |
| GitHub Actions | CI/CD pipeline |
| ESLint + Prettier | Code quality |
