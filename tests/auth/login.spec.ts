import { test, expect } from '../../fixtures/test-fixtures';
import { generateUniqueEmail, registerNewUserViaApi } from '../../utils/helpers';

// docs/test-cases/auth.md — Section 1 (Happy: TC_AUTH_002), Section 2 (Negative: N05-N08),
// Section 3 (Edge: E01, E02)

test.describe('login with a registered account', () => {
  let name: string;
  let email: string;
  let password: string;

  // Registration itself isn't under test here, so the account is created via
  // the API (fast, and avoids the ad-heavy account information form) and the
  // resulting session is logged back out, leaving each test to perform its
  // own login attempt against a known, pre-existing account.
  test.beforeEach(async ({ page, homePage, loginPage }) => {
    name = 'QA Login Test';
    email = generateUniqueEmail('auth_login');
    ({ password } = await registerNewUserViaApi(page, loginPage, name, email));
    await homePage.logout();
  });

  test('TC_AUTH_002 — Login with valid credentials', async ({ page, homePage, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(email, password);

    await expect(page).toHaveURL(/automationexercise\.com\/?$/);
    await homePage.expectLoggedInAs(name);
    await expect(homePage.logoutLink).toBeVisible();
    await expect(homePage.deleteAccountLink).toBeVisible();
    await expect(homePage.signupLoginLink).toBeHidden();
  });

  test('TC_AUTH_N06 — Login with a registered email and an incorrect password', async ({
    page,
    loginPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(email, 'WrongPassword1!');

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.loginErrorMessage).toBeVisible();
  });

  test('TC_AUTH_E01 — Login with the registered email in different letter case', async ({
    page,
    loginPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(email.toUpperCase(), password);

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.loginErrorMessage).toBeVisible();
  });

  test('TC_AUTH_E02 — Login with leading and trailing whitespace in the email field', async ({
    page,
    homePage,
    loginPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(`  ${email}  `, password);

    await expect(page).toHaveURL(/automationexercise\.com\/?$/);
    await homePage.expectLoggedInAs(name);
  });
});

test.describe('login without a matching account', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC_AUTH_N05 — Login with an unregistered email and password combination', async ({
    page,
    loginPage,
    homePage,
  }) => {
    await loginPage.login(generateUniqueEmail('no_such_user'), 'RandomPass999!');

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.loginErrorMessage).toBeVisible();
    await homePage.expectLoggedOut();
  });

  test('TC_AUTH_N07 — Login with an unregistered email', async ({ page, loginPage }) => {
    await loginPage.login(generateUniqueEmail('unregistered'), 'TestPass123!');

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.loginErrorMessage).toBeVisible();
  });

  test('TC_AUTH_N08 — Login with missing required credentials', async ({ page, loginPage }) => {
    await loginPage.loginButton.click();

    await expect(page).toHaveURL(/\/login$/);
    const isEmailFieldValid = await loginPage.loginEmailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid,
    );
    expect(isEmailFieldValid).toBe(false);
  });
});
