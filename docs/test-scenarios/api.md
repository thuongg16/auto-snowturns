# API Test Scenarios

These scenarios cover the public REST API documented at `/api_list` on Automation Exercise, based on direct verification by calling each endpoint (`https://automationexercise.com/api/...`). They define **what** should be tested; step-by-step actions and expected results belong to the Test Case phase.

A key verified characteristic of this API: **the HTTP transport status code is always 200**, regardless of outcome. The actual result (success, validation error, not found, unsupported method) is communicated through a `responseCode` field inside the JSON response body (e.g. `200`, `201`, `400`, `404`, `405`), not through the HTTP status line. This is treated as a core, verified contract detail rather than an assumption.

## 1. Products & Brands

### API-S01 — Retrieve the full product list via GET productsList
Verifies that the endpoint returns a `responseCode` of 200 and a list of products with expected fields (id, name, price, brand, category).

### API-S02 — Attempt an unsupported method on productsList
Verifies that calling `productsList` with an unsupported HTTP method (POST) returns a `responseCode` of 405.

### API-S03 — Retrieve the full brand list via GET brandsList
Verifies that the endpoint returns a `responseCode` of 200 and a list of brands.

### API-S04 — Attempt an unsupported method on brandsList
Verifies that calling `brandsList` with an unsupported HTTP method (PUT) returns a `responseCode` of 405.

## 2. Product Search

### API-S05 — Search products via POST searchProduct with a valid parameter
Verifies that submitting a valid `search_product` parameter returns a `responseCode` of 200 and a list of matching products.

### API-S06 — Search products via POST searchProduct with a missing parameter
Verifies that omitting the required `search_product` parameter returns a `responseCode` of 400 with an explanatory message.

## 3. Login Verification

### API-S07 — Verify login with valid, registered credentials
Verifies that submitting an email/password pair belonging to an existing account returns a `responseCode` of 200.

### API-S08 — Verify login with credentials that do not match any account
Verifies that submitting an email/password pair with no matching account returns a `responseCode` of 404.

### API-S09 — Verify login with a missing parameter
Verifies that omitting the email or password parameter returns a `responseCode` of 400.

### API-S10 — Attempt an unsupported method on verifyLogin
Verifies that calling `verifyLogin` with an unsupported HTTP method (DELETE) returns a `responseCode` of 405.

## 4. Account Lifecycle

### API-S11 — Create a new account via POST createAccount
Verifies that submitting a complete, valid account payload returns a `responseCode` of 201 and creates a retrievable account.

### API-S12 — Retrieve user details via GET getUserDetailByEmail
Verifies that querying by the email of a just-created account returns that account's details with a `responseCode` of 200.

### API-S13 — Update an existing account via PUT updateAccount
Verifies that submitting updated account data for an existing account returns a `responseCode` of 200 and the account reflects the update.

### API-S14 — Delete an account via DELETE deleteAccount
Verifies that deleting an existing account returns a `responseCode` of 200.

### API-S15 — Verify login fails after the account has been deleted
Verifies that, at the API level, credentials for a just-deleted account no longer verify successfully (`responseCode` 404), confirming the deletion took effect.

## 5. Scenario Coverage Summary

| ID | Area | Scenario | Priority |
|----|------|----------|----------|
| API-S01 | Products & Brands | Retrieve the full product list via GET productsList | High |
| API-S02 | Products & Brands | Attempt an unsupported method on productsList | Low |
| API-S03 | Products & Brands | Retrieve the full brand list via GET brandsList | Medium |
| API-S04 | Products & Brands | Attempt an unsupported method on brandsList | Low |
| API-S05 | Product Search | Search products via POST searchProduct with a valid parameter | High |
| API-S06 | Product Search | Search products via POST searchProduct with a missing parameter | Medium |
| API-S07 | Login Verification | Verify login with valid, registered credentials | High |
| API-S08 | Login Verification | Verify login with credentials that do not match any account | High |
| API-S09 | Login Verification | Verify login with a missing parameter | Medium |
| API-S10 | Login Verification | Attempt an unsupported method on verifyLogin | Low |
| API-S11 | Account Lifecycle | Create a new account via POST createAccount | High |
| API-S12 | Account Lifecycle | Retrieve user details via GET getUserDetailByEmail | Medium |
| API-S13 | Account Lifecycle | Update an existing account via PUT updateAccount | Medium |
| API-S14 | Account Lifecycle | Delete an account via DELETE deleteAccount | Medium |
| API-S15 | Account Lifecycle | Verify login fails after the account has been deleted | Medium |
