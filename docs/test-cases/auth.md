# Authentication Test Cases

These test cases implement the scenarios defined in `docs/test-scenarios/auth.md`. Each case describes concrete tester actions and observable expected results, grounded in behavior verified directly on the live application (https://automationexercise.com/).

## 1. Happy Cases

### TC_AUTH_001 — Register a new user with valid information

- Type: Happy
- Priority: High
- Scenario: AUTH-S01
- Preconditions: Tester has access to the Automation Exercise home page and no account exists for the email used in this test.
- Test Data:
  - Name: `QA Test User`
  - Email: a newly generated unique address, e.g. `auth_tc001_<timestamp>@example.com`
  - Password: `TestPass123!`
  - Date of birth: any valid day/month/year
  - First name: `QA`, Last name: `Test`
  - Address: `123 Test Street`, Country: `United States`, State: `CA`, City: `Los Angeles`, Zipcode: `90001`, Mobile number: `1234567890`

#### Steps

1. Navigate to the Automation Exercise home page and select "Signup / Login".
2. Under "New User Signup!", enter the test Name and Email, then submit.
3. On the account information form, select a title, enter the Password, select a date of birth, enter First Name and Last Name, enter the Address, Country, State, City, Zipcode, and Mobile Number.
4. Submit the account information form.
5. On the confirmation page, select "Continue".

#### Expected Result

1. After step 2, the tester is taken to the account information form (URL changes to the signup page).
2. After step 4, the tester is taken to an account confirmation page showing an "ACCOUNT CREATED!" message.
3. After step 5, the tester is returned to the home page and the navigation bar displays "Logged in as QA Test User" along with "Logout" and "Delete Account" options.

---

### TC_AUTH_002 — Login with valid credentials

- Type: Happy
- Priority: High
- Scenario: AUTH-S06
- Preconditions: A registered test account exists (email/password known to the tester).
- Test Data:
  - Email: dedicated registered test account
  - Password: corresponding valid password

#### Steps

1. Navigate to the "Signup / Login" page.
2. Enter the registered account's email in the "Login" section.
3. Enter the matching password.
4. Select the "Login" button.

#### Expected Result

1. The tester is redirected away from the login page (to the home page).
2. The navigation bar displays "Logged in as [Name]" for the authenticated account.
3. "Logout" and "Delete Account" options are visible in the navigation bar; the "Signup / Login" option is no longer shown.

---

### TC_AUTH_003 — Logout from an authenticated session

- Type: Happy
- Priority: High
- Scenario: AUTH-S11, AUTH-S12
- Preconditions: A registered test account exists and the tester is currently logged in with it.
- Test Data:
  - Email: the registered test account's email
  - Password: the registered test account's password

#### Steps

1. While logged in, locate the "Logout" option in the navigation bar.
2. Select "Logout".
3. Observe the resulting page and navigation bar.

#### Expected Result

1. The tester is redirected to the login page (URL changes to the login page).
2. The navigation bar no longer displays "Logged in as [Name]", "Logout", or "Delete Account".
3. The "Signup / Login" option is visible again in the navigation bar, and the login form (email/password fields) is present on the page.

---

### TC_AUTH_004 — Delete account while authenticated

- Type: Happy
- Priority: Medium
- Scenario: AUTH-S13
- Preconditions: A dedicated test account is created specifically for this test (not reused from other test cases) and the tester is logged in with it.
- Test Data:
  - Name: `QA Delete Test`
  - Email: a newly generated unique address, e.g. `auth_tc004_<timestamp>@example.com`
  - Password: `TestPass123!`
  - Registration fields: same categories as TC_AUTH_001 (address, country, state, city, zipcode, mobile number)

#### Steps

1. Register a new account using the test data above and confirm the account is created and the session is authenticated (per TC_AUTH_001).
2. While logged in, locate and select the "Delete Account" option in the navigation bar.
3. On the account deletion confirmation page, select "Continue".
4. Observe the resulting home page and navigation bar.

#### Expected Result

1. The tester is taken to a confirmation page displaying "ACCOUNT DELETED!".

2. After selecting "Continue", the tester is returned to the home page and the navigation bar shows "Signup / Login" instead of the authenticated navigation options.

## 2. Negative Cases

### TC_AUTH_N01 — Register with an existing email address

- Type: Negative
- Priority: Medium
- Scenario: AUTH-S02
- Preconditions: A registered test account already exists with a known email address.
- Test Data:
  - Name: `QA Duplicate Test`
  - Email: the email address of the already-registered test account

#### Steps

1. Navigate to the "Signup / Login" page.
2. Under "New User Signup!", enter the test Name and the already-registered Email.
3. Select the "Signup" button.

#### Expected Result

1. The tester remains on the Signup/Login page (no navigation to the account information form).
2. The page displays the message "Email Address already exist!" under the signup section.
3. No new account is created for this email address.

---

### TC_AUTH_N02 — Register with missing required information

- Type: Negative
- Priority: High
- Scenario: AUTH-S04
- Preconditions: Tester has reached the account information form via a valid name/email signup step.
- Test Data:
  - Name and Email: valid, newly generated values (per TC_AUTH_001)
  - Required fields intentionally left blank: Password, First Name, Last Name, Address, State, City, Zipcode, Mobile Number

#### Steps

1. Complete the initial signup step (name + email) to reach the account information form.
2. Leave the Password field empty.
3. Required text/input fields intentionally left blank:
Password, First Name, Last Name, Address, State, City,
Zipcode, Mobile Number
Country: leave at the default selected value
4. Select "Create Account".

#### Expected Result

1. The form does not submit; the tester remains on the account information page.
2. The browser highlights the first empty required field using native required-field validation, preventing progression until required fields are completed.
3. No "ACCOUNT CREATED!" confirmation page is reached.

---

### TC_AUTH_N03 — Register with an invalid (malformed) email format

- Type: Negative
- Priority: Medium
- Scenario: AUTH-S03
- Preconditions: Tester is on the "Signup / Login" page.
- Test Data:
  - Name: `QA Malformed Email`
  - Email: `not-an-email` (no `@` symbol)

#### Steps

1. Navigate to the "Signup / Login" page.
2. Under "New User Signup!", enter the test Name and the malformed Email value.
3. Select the "Signup" button.

#### Expected Result

1. The form is not submitted; the tester remains on the Signup/Login page.
2. The email field is flagged as invalid by the browser's native email-format validation. (The exact validation message is browser-dependent, since this is HTML5 built-in validation rather than application-defined text.)
3. No account information form or account is created from this attempt.

---

### TC_AUTH_N04 — Register with an empty password field

- Type: Negative
- Priority: Low
- Scenario: AUTH-S05
- Preconditions: Tester has reached the account information form via a valid name/email signup step.
- Test Data:
  - Name and Email: valid, newly generated values
  - All other required fields (First Name, Last Name, Address, State, City, Zipcode, Mobile Number, Country): filled with valid values
  - Password: left empty

#### Steps

1. Complete the initial signup step (name + email) to reach the account information form.
2. Fill in all required fields except Password.
3. Leave the Password field empty.
4. Select "Create Account".

#### Expected Result

1. The form does not submit; the tester remains on the account information page.
2. The browser's native required-field validation flags the empty Password field.
3. No "ACCOUNT CREATED!" confirmation page is reached.

---

### TC_AUTH_N05 — Login with an unregistered email and password combination

- Type: Negative
- Priority: High
- Scenario: AUTH-S07
- Preconditions: The email/password combination used does not match any existing account.
- Test Data:
  - Email: `no_such_user_<timestamp>@example.com`
  - Password: `RandomPass999!`

#### Steps

1. Navigate to the "Signup / Login" page.
2. Enter the non-matching Email and Password in the Login section.
3. Select the "Login" button.

#### Expected Result

1. The tester remains on the login page (no redirection to the home page).
2. The message "Your email or password is incorrect!" is displayed.
3. No logged-in navigation state (no "Logged in as...", "Logout", or "Delete Account") appears.

---

### TC_AUTH_N06 — Login with a registered email and an incorrect password

- Type: Negative
- Priority: High
- Scenario: AUTH-S08
- Preconditions: A registered test account exists with a known email and password.
- Test Data:
  - Email: the registered test account's email
  - Password: an incorrect value, e.g. `WrongPassword1!`

#### Steps

1. Navigate to the "Signup / Login" page.
2. Enter the registered account's Email and an incorrect Password in the Login section.
3. Select the "Login" button.

#### Expected Result

1. The tester remains on the login page (no redirection to the home page).
2. The message "Your email or password is incorrect!" is displayed.
3. No logged-in navigation state appears.

---

### TC_AUTH_N07 — Login with an unregistered email

- Type: Negative
- Priority: Medium
- Scenario: AUTH-S09
- Preconditions: The email used has no associated account.
- Test Data:
  - Email: `unregistered_<timestamp>@example.com`
  - Password: `TestPass123!` (syntactically valid, arbitrary)

#### Steps

1. Navigate to the "Signup / Login" page.
2. Enter the unregistered Email and any syntactically valid Password in the Login section.
3. Select the "Login" button.

#### Expected Result

1. The tester remains on the login page (no redirection to the home page).
2. The message "Your email or password is incorrect!" is displayed.
3. No logged-in navigation state appears.

---

### TC_AUTH_N08 — Login with missing required credentials

- Type: Negative
- Priority: Medium
- Scenario: AUTH-S10
- Preconditions: Tester is on the "Signup / Login" page and not authenticated.
- Test Data: Email and Password fields left empty.

#### Steps

1. Navigate to the "Signup / Login" page.
2. Leave both the Email and Password fields empty.
3. Select the "Login" button.

#### Expected Result

1. The form does not submit; the tester remains on the login page (URL unchanged).
2. The The browser's native required-field validation prevents form submission and identifies the first required field that is missing.
3. No logged-in navigation state appears.

---

### TC_AUTH_N09 — Login attempt using deleted account credentials

- Type: Negative
- Priority: Medium
- Scenario: AUTH-S14
- Preconditions: None (this test creates its own dedicated account and does not depend on other test cases).
- Test Data:
  - Name: `QA Deleted Login Test`
  - Email: a newly generated unique address, e.g. `auth_n09_<timestamp>@example.com`
  - Password: `TestPass123!`

#### Steps

1. Register a new account using the test data above (per TC_AUTH_001) and confirm the session is authenticated.
2. Select "Delete Account" and confirm the account deletion confirmation page is displayed.
3. Navigate to the "Signup / Login" page.
4. Enter the same Email and Password used in step 1.
5. Select the "Login" button.

#### Expected Result

1. After step 2, the account deletion is confirmed ("ACCOUNT DELETED!" message) and the session ends.
2. After step 5, the tester remains on the login page (no redirection to the home page).
3. The message "Your email or password is incorrect!" is displayed, confirming the deleted account's credentials no longer grant access.

## 3. Edge Cases

### TC_AUTH_E01 — Login with the registered email in different letter case

- Type: Edge
- Priority: Low
- Scenario: AUTH-S09
- Preconditions: A registered test account exists with a known, lowercase email address.
- Test Data:
  - Email: the registered account's email converted to uppercase (e.g. `USER@EXAMPLE.COM` where the account was registered as `user@example.com`)
  - Password: the registered account's correct password

#### Steps

1. Navigate to the "Signup / Login" page.
2. Enter the registered account's email in uppercase, with the correct password.
3. Select the "Login" button.

#### Expected Result

1. The tester remains on the login page (no redirection to the home page).
2. The message "Your email or password is incorrect!" is displayed, indicating that login matching for this account is case-sensitive on the email address.

---

### TC_AUTH_E02 — Login with leading and trailing whitespace in the email field

- Type: Edge
- Priority: Low
- Scenario: AUTH-S06
- Preconditions: A registered test account exists with a known email and password.
- Test Data:
  - Email: the registered account's email with added leading and trailing spaces (e.g. `  user@example.com  `)
  - Password: the registered account's correct password

#### Steps

1. Navigate to the "Signup / Login" page.
2. Enter the registered account's email with leading/trailing spaces, and the correct password.
3. Select the "Login" button.

#### Expected Result

1. The tester is redirected away from the login page (to the home page).
2. The navigation bar displays the logged-in state for the account, confirming the surrounding whitespace does not prevent a successful match.

---

### TC_AUTH_E03 — Register with an existing email in a different letter case

- Type: Edge
- Priority: Low
- Scenario: AUTH-S02
- Preconditions: A registered test account already exists with a known, lowercase email address.
- Test Data:
  - Name: `QA Case Test`
  - Email: the existing account's email converted to uppercase

#### Steps

1. Navigate to the "Signup / Login" page.
2. Under "New User Signup!", enter a new Name and the existing account's email in uppercase.
3. Select the "Signup" button.

#### Expected Result

1. The tester is taken to the account information form (not blocked with an "already exist" message).
2. This confirms the existing-email check treats a different letter case as a distinct, unused email address rather than a duplicate.

## 4. Traceability Summary

| Scenario ID | Scenario | Test Case IDs |
|---|---|---|
| AUTH-S01 | Register a new user with valid information | TC_AUTH_001 |
| AUTH-S02 | Register with an existing email address | TC_AUTH_N01, TC_AUTH_E03 |
| AUTH-S03 | Register with invalid or malformed input | TC_AUTH_N03 |
| AUTH-S04 | Register with missing required information | TC_AUTH_N02 |
| AUTH-S05 | Register with invalid password data | TC_AUTH_N04 |
| AUTH-S06 | Successful login with valid credentials | TC_AUTH_002, TC_AUTH_E02 |
| AUTH-S07 | Login with invalid credentials (unregistered combination) | TC_AUTH_N05 |
| AUTH-S08 | Login with incorrect password | TC_AUTH_N06 |
| AUTH-S09 | Login with incorrect (unregistered) email | TC_AUTH_N07, TC_AUTH_E01 |
| AUTH-S10 | Login with missing required credentials | TC_AUTH_N08 |
| AUTH-S11 | Successful logout from an authenticated session | TC_AUTH_003 |
| AUTH-S12 | Application state after logout | TC_AUTH_003 |
| AUTH-S13 | Delete account while authenticated | TC_AUTH_004 |
| AUTH-S14 | Login attempt after account deletion | TC_AUTH_N09 |
