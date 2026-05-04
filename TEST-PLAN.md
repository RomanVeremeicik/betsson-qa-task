# Test Plan — Betsson QA Technical Task

## Overview

This document outlines the test plan for two major features of [SauceDemo](https://www.saucedemo.com/) and two API endpoints of [Petstore](https://petstore.swagger.io/).

---

## Part 1: UI Testing — SauceDemo

### Feature 1: Login

| ID | Test Case | Priority | Type | Expected Result |
|---|---|---|---|---|
| TC-LOGIN-01 | Login with valid credentials | High | Smoke | Redirected to inventory page |
| TC-LOGIN-02 | Login with invalid password | High | Regression | Error message shown |
| TC-LOGIN-03 | Login with locked-out user | High | Regression | Locked-out error shown |
| TC-LOGIN-04 | Login with empty username | Medium | Regression | "Username is required" error |
| TC-LOGIN-05 | Login with empty password | Medium | Regression | "Password is required" error |
| TC-LOGIN-06 | Login with both fields empty | Medium | Regression | "Username is required" error |

**Preconditions:** User is on the SauceDemo login page  
**Test Data:** `standard_user / secret_sauce`, `locked_out_user / secret_sauce`

---

### Feature 2: Shopping Cart

| ID | Test Case | Priority | Type | Expected Result |
|---|---|---|---|---|
| TC-CART-01 | Add single item to cart | High | Smoke | Badge shows count 1 |
| TC-CART-02 | Add multiple items to cart | High | Regression | Badge reflects correct count |
| TC-CART-03 | Remove item from inventory page | High | Regression | Badge decrements |
| TC-CART-04 | Remove item from cart page | High | Regression | Item removed from cart |
| TC-CART-05 | Complete full checkout flow | High | Smoke | Order confirmation shown |
| TC-CART-06 | Checkout with missing shipping info | Medium | Regression | Validation error shown |

**Preconditions:** User is logged in as `standard_user`  
**Test Data:** Products: "Sauce Labs Backpack", "Sauce Labs Bike Light"

---

## Part 2: API Testing — Petstore

### API 1: POST /pet — Add New Pet

| ID | Test Case | Priority | Type | Expected Result |
|---|---|---|---|---|
| TC-API-PET-01 | Create pet with valid payload | High | Smoke | 200 OK, response matches schema |
| TC-API-PET-02 | Created pet is retrievable via GET | High | Regression | GET returns same pet data |
| TC-API-PET-03 | Create pet with all optional fields | Medium | Regression | 200 OK, all fields persisted |
| TC-API-PET-04 | Create pet with invalid payload | Medium | Regression | 4xx error returned |

**Base URL:** `https://petstore.swagger.io/v2`  
**Schema Validation:** All responses validated against Zod schema

---

### API 2: GET /pet/{petId} — Find Pet by ID

| ID | Test Case | Priority | Type | Expected Result |
|---|---|---|---|---|
| TC-API-GET-01 | Get existing pet by ID | High | Smoke | 200 OK, valid schema |
| TC-API-GET-02 | Get non-existent pet | High | Regression | 404 Not Found |
| TC-API-GET-03 | Get pet with invalid (non-numeric) ID | Medium | Regression | 4xx error |
| TC-API-GET-04 | Verify all fields match created pet | High | Regression | All fields correct |

---

## Test Execution

```bash
# All tests
npm test

# Smoke tests only (fast feedback)
npm run test:smoke

# Regression suite
npm run test:regression

# UI only
npm run test:ui

# API only
npm run test:api
```

## Entry & Exit Criteria

**Entry:** Code committed, dependencies installed, environment configured  
**Exit:** All smoke tests pass, no critical regression failures
