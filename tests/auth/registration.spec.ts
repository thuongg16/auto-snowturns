import { test, expect } from '../../fixtures/test-fixtures';
import { generateUniqueEmail, getNewUserDetails, registerNewUser } from '../../utils/helpers';

// docs/test-cases/auth.md — Section 1 (Happy: TC_AUTH_001), Section 2 (Negative: N01-N04),
// Section 3 (Edge: E03)

const newUserDetails = getNewUserDetails();

test('TC_AUTH_001 — Register a new user with valid information', { tag: ['@critical'] }, async ({
  page,
  homePage,
  loginPage,
  accountPage,
  request,
}) => {
  const name = 'QA Test User';
  const email = generateUniqueEmail('auth_tc001');

  await homePage.goto();
  await homePage.goToSignupLogin();
  await loginPage.startSignup(name, email);
  await expect(page).toHaveURL(/\/signup$/);

  await accountPage.createAccount(newUserDetails);
  await accountPage.expectAccountCreated();

  await accountPage.continueToHome();
  await homePage.expectLoggedInAs(name);
  await expect(homePage.logoutLink).toBeVisible();
  await expect(homePage.deleteAccountLink).toBeVisible();

  // Cross-check via the API, independently of the UI's own "success" claim,
  // that the account was actually persisted with the submitted data.
  const detailResponse = await request.get(`/api/getUserDetailByEmail?email=${encodeURIComponent(email)}`);
  const detailBody = await detailResponse.json();
  expect(detailBody.responseCode).toBe(200);
  expect(detailBody.user).toEqual(
    expect.objectContaining({
      name,
      email,
      first_name: newUserDetails.firstName,
      last_name: newUserDetails.lastName,
    }),
  );
});

test('TC_AUTH_N01 — Register with an existing email address', async ({
  homePage,
  loginPage,
  accountPage,
}) => {
  const existingEmail = generateUniqueEmail('auth_n01');
  await registerNewUser(loginPage, accountPage, 'QA Existing User', existingEmail, newUserDetails);
  // Navigating to /login while authenticated redirects to home, so log out
  // first to reach the anonymous-visitor state this negative case requires.
  await homePage.logout();

  await loginPage.goto();
  await loginPage.startSignup('QA Duplicate Test', existingEmail);

  // The site redisplays the login/signup form (URL may read /signup) rather
  // than advancing to the account information form.
  await expect(loginPage.signupErrorMessage).toBeVisible();
  await expect(accountPage.firstNameInput).toBeHidden();
});

test('TC_AUTH_N02 — Register with missing required information', { tag: ['@critical'] }, async ({ page, loginPage, accountPage }) => {
  const email = generateUniqueEmail('auth_n02');

  await loginPage.goto();
  await loginPage.startSignup('QA Missing Fields', email);
  await expect(page).toHaveURL(/\/signup$/);

  // Password, First/Last Name, Address, State, City, Zipcode, Mobile Number
  // are intentionally left blank; Country is left at its default value.
  await accountPage.createAccountButton.click();

  await expect(page).toHaveURL(/\/signup$/);
  await expect(accountPage.accountCreatedHeading).toBeHidden();
});

test('TC_AUTH_N03 — Register with an invalid (malformed) email format', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.startSignup('QA Malformed Email', 'not-an-email');

  await expect(page).toHaveURL(/\/login$/);
  const isEmailFieldValid = await loginPage.signupEmailInput.evaluate(
    (el: HTMLInputElement) => el.validity.valid,
  );
  expect(isEmailFieldValid).toBe(false);
});

test('TC_AUTH_N04 — Register with an empty password field', async ({ page, loginPage, accountPage }) => {
  const email = generateUniqueEmail('auth_n04');

  await loginPage.goto();
  await loginPage.startSignup('QA Empty Password', email);
  await accountPage.fillAccountDetails({ ...newUserDetails, password: '' });
  await accountPage.createAccountButton.click();

  await expect(page).toHaveURL(/\/signup$/);
  await expect(accountPage.accountCreatedHeading).toBeHidden();
});

test('TC_AUTH_E03 — Register with an existing email in a different letter case', async ({
  page,
  homePage,
  loginPage,
  accountPage,
}) => {
  const lowerCaseEmail = generateUniqueEmail('auth_e03');
  await registerNewUser(loginPage, accountPage, 'QA Case Source', lowerCaseEmail, newUserDetails);
  // Navigating to /login while authenticated redirects to home, so log out
  // first to reach the anonymous-visitor state this edge case requires.
  await homePage.logout();

  await loginPage.goto();
  await loginPage.startSignup('QA Case Test', lowerCaseEmail.toUpperCase());

  await expect(page).toHaveURL(/\/signup$/);
  await expect(loginPage.signupErrorMessage).toBeHidden();
  await expect(accountPage.firstNameInput).toBeVisible();
});
