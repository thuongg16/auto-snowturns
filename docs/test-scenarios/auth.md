# Authentication Test Scenarios

These scenarios cover registration, login, logout, and account deletion on Automation Exercise, based on direct verification of the live application (`/login`, `/signup`, `/account_created`, `/delete_account`). They define **what** should be tested; step-by-step actions and expected results belong to the Test Case phase.

## 1. Registration

### AUTH-S01 — Register a new user with valid information
Verifies that a visitor can successfully create a new user account using valid registration information.

### AUTH-S02 — Register with an existing email address
Verifies that attempting the initial signup step (name + email) with an email already tied to an account is rejected with an inline error, and no new account or duplicate record is created.

### AUTH-S03 — Register with invalid or malformed input
Verifies how the registration form handles input that does not conform to expected formats (e.g., a malformed email address at the signup step), without assuming a specific validation message beyond what the form actually enforces.

### AUTH-S04 — Register with missing required information
Verifies that the account information step (name, email, password, address, country, state, city, zipcode, mobile number) cannot be submitted while required fields are left empty, and that the user remains able to correct and resubmit the form.

### AUTH-S05 — Register with invalid password data
Verifies handling of an empty or non-conforming password value at the account information step. Note: the application exposes a single password field with no separate confirmation field, so this scenario does not cover password-confirmation matching.

## 2. Login

### AUTH-S06 — Successful login with valid credentials
Verifies that a registered user can successfully authenticate using valid credentials (logged-in indicator, Logout/Delete Account options).

### AUTH-S07 — Login with invalid credentials (unregistered email and password combination)
Verifies that attempting login with an email/password combination that does not match any account is rejected with an on-page error, and no session is created.

### AUTH-S08 — Login with incorrect password
Verifies that using a registered account's email with a wrong password is rejected in the same manner as other invalid-credential attempts.

### AUTH-S09 — Login with incorrect (unregistered) email
Verifies that using an email address with no associated account is rejected, regardless of the password supplied.

### AUTH-S10 — Login with missing required credentials
Verifies that the login form does not proceed when the email and/or password fields are left empty, relying on the form's built-in required-field behavior.

## 3. Logout

### AUTH-S11 — Successful logout from an authenticated session
Verifies that a logged-in user can log out via the navigation menu, is returned to the login page, and the UI reverts to a logged-out state (Signup/Login option restored, Logout/Delete Account options removed).

### AUTH-S12 — Application state after logout
Verifies that once logged out, session-dependent UI elements (Logout, Delete Account, "Logged in as...") are no longer present, confirming the authenticated session has ended rather than merely being visually hidden.

## 4. Account Access / Account Deletion

### AUTH-S13 — Delete account while authenticated
Verifies that a logged-in user can permanently delete their account via the "Delete Account" option, is shown a deletion confirmation page, and the session ends as a result.

### AUTH-S14 — Login attempt after account deletion
Verifies that credentials belonging to a deleted account can no longer be used to log in, confirming the account and its access are fully removed rather than merely deactivated.

## 5. Scenario Coverage Summary

| ID | Area | Scenario | Priority |
|----|------|----------|----------|
| AUTH-S01 | Registration | Register a new user with valid information | High |
| AUTH-S02 | Registration | Register with an existing email address | Medium |
| AUTH-S03 | Registration | Register with invalid or malformed input | Medium |
| AUTH-S04 | Registration | Register with missing required information | High |
| AUTH-S05 | Registration | Register with invalid password data | Low |
| AUTH-S06 | Login | Successful login with valid credentials | High |
| AUTH-S07 | Login | Login with invalid credentials (unregistered combination) | High |
| AUTH-S08 | Login | Login with incorrect password | High |
| AUTH-S09 | Login | Login with incorrect (unregistered) email | Medium |
| AUTH-S10 | Login | Login with missing required credentials | Medium |
| AUTH-S11 | Logout | Successful logout from an authenticated session | High |
| AUTH-S12 | Logout | Application state after logout | Medium |
| AUTH-S13 | Account Access | Delete account while authenticated | Medium |
| AUTH-S14 | Account Access | Login attempt after account deletion | Medium |
