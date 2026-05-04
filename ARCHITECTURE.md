# Architecture & Design Decisions

## Overview

This document explains the architectural choices made for this QA framework, the reasoning behind them, and any trade-offs considered.

---

## Technology Stack

| Concern         | Choice                        | Rationale                                                                 |
|-----------------|-------------------------------|---------------------------------------------------------------------------|
| Framework       | Playwright (TypeScript)       | Native support for both UI and API testing in one tool                   |
| Language        | TypeScript (strict mode)      | Type safety catches errors at compile time, not at runtime               |
| Schema validation | Zod                         | Runtime API response validation with excellent TypeScript integration     |
| Linting         | ESLint + @typescript-eslint   | Enforces consistent code style and catches common mistakes               |
| Formatting      | Prettier                      | Eliminates style debates, consistent output across team                  |
| CI/CD           | GitHub Actions                | Native GitHub integration, free for public repos, matrix job support     |

**Why one repository?** The task explicitly notes this is an option (General Notes §1). A mono-repo avoids duplicating configuration (tsconfig, eslint, playwright.config) and allows shared utilities, schemas, and fixtures to be reused across UI and API tests.

---

## Project Structure

```
betsson-qa-task/
├── tests/
│   ├── ui/            # UI end-to-end tests (Page Object consumers)
│   └── api/           # API tests (request/response contracts)
├── pages/             # Page Object Model classes
├── fixtures/          # Custom Playwright fixtures (dependency injection)
├── schemas/           # Zod schemas for API response validation
├── utils/             # Shared helpers (API builders, retry logic)
├── .github/workflows/ # CI/CD pipeline
├── playwright.config.ts
├── tsconfig.json
└── ARCHITECTURE.md
```

---

## UI Framework Design

### Page Object Model (POM)

Each page of the application under test has a corresponding class in `/pages`. These classes:

- Encapsulate all locators using `data-test` attributes (stable, test-specific selectors)
- Expose semantic methods (`login()`, `addItemToCart()`) instead of raw Playwright calls
- Include built-in assertion helpers (`expectErrorMessage()`, `expectCartBadgeCount()`)

**Why `data-test` attributes?** CSS classes and element structure change during refactors. `data-test` attributes are stable, explicitly maintained for testing, and are the convention used by the saucedemo application itself.

### Custom Fixtures

Playwright fixtures (`/fixtures/index.ts`) act as a **dependency injection system**. Instead of repeating `new LoginPage(page)` in every test, fixtures auto-instantiate page objects and inject them:

```typescript
// Without fixtures (repetitive)
test('example', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  // ...
});

// With fixtures (clean)
test('example', async ({ loginPage }) => {
  await loginPage.navigate();
  // ...
});
```

The `authenticatedPage` fixture goes further — it automatically navigates and logs in, so cart/checkout tests don't repeat the login flow. This is equivalent to a reusable `@BeforeEach` with state.

### Test Organisation

Tests use **descriptive IDs** (e.g. `TC-LOGIN-01`) that map to the test plan, making it easy to trace from a failing test back to a requirement. Tags (`@smoke`, `@regression`) allow selective execution:

```bash
npm run test:smoke       # fast feedback loop
npm run test:regression  # full suite
```

---

## API Framework Design

### Playwright API Testing

Playwright's built-in `request` context is used for API tests — no extra libraries needed. The `baseURL` is configured per-project in `playwright.config.ts`, keeping test code clean:

```typescript
// Tests just use relative paths
await request.post('/pet', { data: payload });
await request.get(`/pet/${id}`);
```

### Zod Schema Validation

Every API response is validated against a Zod schema via the `parseResponse()` utility. This approach:

1. **Validates structure** — not just status codes. A 200 with wrong field types is caught.
2. **Self-documents contracts** — schemas serve as living documentation of expected API shape.
3. **Fails loudly** — when schema validation fails, the error message includes the full received body, making debugging fast.

```typescript
// Without schema validation (weak)
expect(response.status()).toBe(200);
const body = await response.json();
expect(body.name).toBe('Buddy'); // What if body.id is a string instead of number?

// With Zod (strong)
const pet = await parseResponse(response, PetSchema); // throws if schema mismatch
expect(pet.name).toBe('Buddy'); // pet is fully typed as Pet
```

### Retry Logic

Two layers of retry are implemented:

1. **Playwright-level retries** (`retries` in `playwright.config.ts`): Re-runs entire test on failure. Configured as 2 retries on CI, 1 locally. This handles transient network failures.

2. **`retryRequest()` utility**: Retries a specific API call until an expected status code is returned. Used for eventually-consistent GET operations after a POST — the Petstore API can have a small propagation delay.

```typescript
const response = await retryRequest(
  () => request.get(`/pet/${petId}`),
  expectedStatus: 200,
  maxRetries: 3,
  delayMs: 500
);
```

### Test Isolation

Each API test generates a unique `petId` using `generatePetId()` (timestamp + random offset). Since the Petstore is a shared public API, this prevents test interference between parallel runs or concurrent CI executions.

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/playwright.yml`) is designed with parallelism and reporting in mind:

```
push/PR
   ├── job: test-ui    (UI tests on Chromium)
   └── job: test-api   (API tests, no browser)
         └── job: publish-report (deploys HTML report to GitHub Pages)
```

Key decisions:
- **Separate jobs** for UI and API allow them to run in parallel and fail independently
- **`if: always()`** on the report job ensures reports are published even when tests fail
- **Secrets** for credentials — never hardcoded in code or workflow files
- **Artifact retention** of 30 days for historical test result access

---

## Trade-offs & Known Limitations

| Decision | Trade-off |
|---|---|
| Single browser (Chromium) | The task doesn't require cross-browser, adding Firefox/Safari would increase CI time by 2-3x |
| Petstore public API | Shared state means tests can occasionally see data from other users; `generatePetId()` mitigates but doesn't eliminate this |
| No visual regression | Added complexity for a demo app; would be valuable in a real product context |
| `retryRequest()` utility | Adds complexity but necessary for the eventually-consistent Petstore; in a real API this would not be needed |

---

## How to Extend

**Adding a new UI page:**
1. Create `pages/NewPage.ts` extending the POM pattern
2. Add a fixture in `fixtures/index.ts`
3. Write tests in `tests/ui/newFeature.spec.ts`

**Adding a new API endpoint:**
1. Add Zod schemas in `schemas/petstore.schema.ts`
2. Add builder helpers in `utils/apiHelpers.ts` if needed
3. Write tests in `tests/api/newEndpoint.spec.ts`
