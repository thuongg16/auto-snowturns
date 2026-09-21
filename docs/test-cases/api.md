# API Test Cases

These test cases implement the scenarios defined in `docs/test-scenarios/api.md`. Each case describes a concrete API call and observable expected result, grounded in responses captured directly from the live API (https://automationexercise.com/api/). All endpoints were observed to return HTTP transport status **200** in every case; the actual outcome is carried in the JSON body's `responseCode` field — expected results below assert on `responseCode`, not the HTTP status line, unless stated otherwise.

## 1. Happy Cases

### TC_API_001 — GET productsList returns the full product list

- Type: Happy
- Priority: High
- Scenario: API-S01
- Preconditions: None (public, unauthenticated endpoint).
- Test Data: None required.

#### Steps

1. Send a `GET` request to `/api/productsList`.
2. Inspect the JSON response body.

#### Expected Result

1. The response body's `responseCode` is `200`.
2. The body contains a `products` array where each item includes `id`, `name`, `price`, `brand`, and `category`.

---

### TC_API_002 — GET brandsList returns the full brand list

- Type: Happy
- Priority: Medium
- Scenario: API-S03
- Preconditions: None.
- Test Data: None required.

#### Steps

1. Send a `GET` request to `/api/brandsList`.
2. Inspect the JSON response body.

#### Expected Result

1. The response body's `responseCode` is `200`.
2. The body contains a `brands` array where each item includes `id` and `brand`.

---

### TC_API_003 — POST searchProduct with a valid parameter returns matching products

- Type: Happy
- Priority: High
- Scenario: API-S05
- Preconditions: None.
- Test Data: `search_product = top`

#### Steps

1. Send a `POST` request to `/api/searchProduct` with form field `search_product=top`.
2. Inspect the JSON response body.

#### Expected Result

1. The response body's `responseCode` is `200`.
2. The body contains a `products` array whose entries relate to the search term (e.g. product names containing "Top").

---

### TC_API_004 — POST verifyLogin with valid, registered credentials confirms the user exists

- Type: Happy
- Priority: High
- Scenario: API-S07
- Preconditions: A registered account exists (create one via TC_API_005, or use an account created through the UI).
- Test Data: `email` / `password` of a registered account.

#### Steps

1. Send a `POST` request to `/api/verifyLogin` with the registered account's `email` and `password`.
2. Inspect the JSON response body.

#### Expected Result

1. The response body's `responseCode` is `200`.
2. The body's `message` is `"User exists!"`.

---

### TC_API_005 — POST createAccount creates a new user

- Type: Happy
- Priority: High
- Scenario: API-S11
- Preconditions: The email used is not already registered.
- Test Data: A complete account payload — `name`, a newly generated `email`, `password`, `title`, `birth_date`, `birth_month`, `birth_year`, `firstname`, `lastname`, `company`, `address1`, `address2`, `country`, `zipcode`, `state`, `city`, `mobile_number`.

#### Steps

1. Send a `POST` request to `/api/createAccount` with the complete account payload as form fields.
2. Inspect the JSON response body.

#### Expected Result

1. The response body's `responseCode` is `201`.
2. The body's `message` is `"User created!"`.

---

### TC_API_006 — GET getUserDetailByEmail retrieves the created user's details

- Type: Happy
- Priority: Medium
- Scenario: API-S12
- Preconditions: An account has just been created (per TC_API_005) and its email is known.
- Test Data: `email` of the created account.

#### Steps

1. Send a `GET` request to `/api/getUserDetailByEmail?email=<created account's email>`.
2. Inspect the JSON response body.

#### Expected Result

1. The response body's `responseCode` is `200`.
2. The body's `user` object contains the same name, address, and contact details submitted at account creation.

---

### TC_API_007 — PUT updateAccount updates the user's details

- Type: Happy
- Priority: Medium
- Scenario: API-S13
- Preconditions: An account exists (per TC_API_005) with known email/password.
- Test Data: The same `email`/`password` as the existing account, with changed values for `name`, `firstname`, `lastname`, `address1`, `city`, `zipcode`, and `mobile_number`.

#### Steps

1. Send a `PUT` request to `/api/updateAccount` with the account's `email`, `password`, and the updated field values.
2. Inspect the JSON response body.
3. Send a `GET` request to `/api/getUserDetailByEmail?email=<account email>` to confirm the change.

#### Expected Result

1. The response body's `responseCode` (step 2 response) is `200` with `message` `"User updated!"`.
2. The follow-up `getUserDetailByEmail` response reflects the updated field values.

---

### TC_API_008 — DELETE deleteAccount removes the user

- Type: Happy
- Priority: Medium
- Scenario: API-S14
- Preconditions: An account exists with known email/password (dedicated to this test, not reused from other test cases).
- Test Data: `email` / `password` of the account to delete.

#### Steps

1. Send a `DELETE` request to `/api/deleteAccount` with the account's `email` and `password`.
2. Inspect the JSON response body.

#### Expected Result

1. The response body's `responseCode` is `200`.
2. The body's `message` is `"Account deleted!"`.

## 2. Negative Cases

### TC_API_N01 — POST productsList (unsupported method) returns a 405 response code

- Type: Negative
- Priority: Low
- Scenario: API-S02
- Preconditions: None.
- Test Data: None required.

#### Steps

1. Send a `POST` request to `/api/productsList`.
2. Inspect the JSON response body.

#### Expected Result

1. The response body's `responseCode` is `405`.
2. The body's `message` is `"This request method is not supported."`.

---

### TC_API_N02 — PUT brandsList (unsupported method) returns a 405 response code

- Type: Negative
- Priority: Low
- Scenario: API-S04
- Preconditions: None.
- Test Data: None required.

#### Steps

1. Send a `PUT` request to `/api/brandsList`.
2. Inspect the JSON response body.

#### Expected Result

1. The response body's `responseCode` is `405`.
2. The body's `message` is `"This request method is not supported."`.

---

### TC_API_N03 — POST searchProduct with a missing parameter returns a 400 response code

- Type: Negative
- Priority: Medium
- Scenario: API-S06
- Preconditions: None.
- Test Data: An empty POST body (no `search_product` field).

#### Steps

1. Send a `POST` request to `/api/searchProduct` with no `search_product` field.
2. Inspect the JSON response body.

#### Expected Result

1. The response body's `responseCode` is `400`.
2. The body's `message` states that the `search_product` parameter is missing.

---

### TC_API_N04 — POST verifyLogin with non-matching credentials returns a 404 response code

- Type: Negative
- Priority: High
- Scenario: API-S08
- Preconditions: The email/password combination does not match any existing account.
- Test Data: `email = nonexistent_api_<timestamp>@example.com`, `password = whatever123`

#### Steps

1. Send a `POST` request to `/api/verifyLogin` with the non-matching credentials.
2. Inspect the JSON response body.

#### Expected Result

1. The response body's `responseCode` is `404`.
2. The body's `message` is `"User not found!"`.

---

### TC_API_N05 — POST verifyLogin with a missing parameter returns a 400 response code

- Type: Negative
- Priority: Medium
- Scenario: API-S09
- Preconditions: None.
- Test Data: `email` provided, `password` omitted.

#### Steps

1. Send a `POST` request to `/api/verifyLogin` with only the `email` field.
2. Inspect the JSON response body.

#### Expected Result

1. The response body's `responseCode` is `400`.
2. The body's `message` states that the email or password parameter is missing.

---

### TC_API_N06 — DELETE verifyLogin (unsupported method) returns a 405 response code

- Type: Negative
- Priority: Low
- Scenario: API-S10
- Preconditions: None.
- Test Data: None required.

#### Steps

1. Send a `DELETE` request to `/api/verifyLogin`.
2. Inspect the JSON response body.

#### Expected Result

1. The response body's `responseCode` is `405`.
2. The body's `message` is `"This request method is not supported."`.

---

### TC_API_N07 — POST verifyLogin after account deletion returns a 404 response code

- Type: Negative
- Priority: Medium
- Scenario: API-S15
- Preconditions: None (this test creates and deletes its own dedicated account).
- Test Data: A newly created account's `email`/`password`.

#### Steps

1. Create a new account via `POST /api/createAccount` (per TC_API_005).
2. Delete the same account via `DELETE /api/deleteAccount` (per TC_API_008).
3. Send a `POST` request to `/api/verifyLogin` using the same, now-deleted account's `email`/`password`.
4. Inspect the JSON response body.

#### Expected Result

1. After step 2, the deletion response `responseCode` is `200`.
2. After step 4, the response body's `responseCode` is `404` with `message` `"User not found!"`, confirming the deleted account can no longer be verified.

## 3. Edge Cases

### TC_API_E01 — API responses use HTTP 200 as the transport status regardless of logical outcome

- Type: Edge
- Priority: Medium
- Scenario: API-S01
- Preconditions: None.
- Test Data: None required (uses the `GET productsList` call, but the behavior applies across the endpoints tested in this module).

#### Steps

1. Send a `GET` request to `/api/productsList`.
2. Record both the raw HTTP transport status code and the `responseCode` field inside the JSON body.
3. Compare against the equivalent recording from an error-path call (e.g. TC_API_N01, `POST /api/productsList`).

#### Expected Result

1. In both the success case (step 1) and the error case (step 3), the HTTP transport status code is `200`.
2. The actual outcome (success vs. unsupported method) is only distinguishable via the `responseCode` field in the JSON body, not the HTTP status line — a contract detail that must be accounted for when automating assertions against this API.

## 4. Traceability Summary

| Scenario ID | Scenario | Test Case IDs |
|---|---|---|
| API-S01 | Retrieve the full product list via GET productsList | TC_API_001, TC_API_E01 |
| API-S02 | Attempt an unsupported method on productsList | TC_API_N01 |
| API-S03 | Retrieve the full brand list via GET brandsList | TC_API_002 |
| API-S04 | Attempt an unsupported method on brandsList | TC_API_N02 |
| API-S05 | Search products via POST searchProduct with a valid parameter | TC_API_003 |
| API-S06 | Search products via POST searchProduct with a missing parameter | TC_API_N03 |
| API-S07 | Verify login with valid, registered credentials | TC_API_004 |
| API-S08 | Verify login with credentials that do not match any account | TC_API_N04 |
| API-S09 | Verify login with a missing parameter | TC_API_N05 |
| API-S10 | Attempt an unsupported method on verifyLogin | TC_API_N06 |
| API-S11 | Create a new account via POST createAccount | TC_API_005 |
| API-S12 | Retrieve user details via GET getUserDetailByEmail | TC_API_006 |
| API-S13 | Update an existing account via PUT updateAccount | TC_API_007 |
| API-S14 | Delete an account via DELETE deleteAccount | TC_API_008 |
| API-S15 | Verify login fails after the account has been deleted | TC_API_N07 |
