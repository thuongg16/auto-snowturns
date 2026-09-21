import { test, expect } from '../../fixtures/test-fixtures';
import { generateUniqueEmail, registerNewUserViaApi } from '../../utils/helpers';

// docs/test-cases/auth.md — Section 1 (Happy: TC_AUTH_004), Section 2 (Negative: N09)
// Registration isn't under test here, so accounts are created via the API and
// logged in through the UI (see registerNewUserViaApi).

test('TC_AUTH_004 — Delete account while authenticated', async ({
  page,
  homePage,
  loginPage,
  accountPage,
  request,
}) => {
  const email = generateUniqueEmail('auth_tc004');
  await registerNewUserViaApi(page, loginPage, 'QA Delete Test', email);

  await homePage.goToDeleteAccount();
  await accountPage.expectAccountDeleted();

  await accountPage.continueToHome();
  await homePage.expectLoggedOut();

  // Cross-check via the API, independently of the UI's own "success" claim,
  // that the account was actually removed, not just hidden by the UI.
  const detailResponse = await request.get(`/api/getUserDetailByEmail?email=${encodeURIComponent(email)}`);
  const detailBody = await detailResponse.json();
  expect(detailBody.responseCode).toBe(404);
});

test('TC_AUTH_N09 — Login attempt using deleted account credentials', async ({
  page,
  homePage,
  loginPage,
  accountPage,
}) => {
  const email = generateUniqueEmail('auth_n09');
  const { password } = await registerNewUserViaApi(page, loginPage, 'QA Deleted Login Test', email);

  await homePage.goToDeleteAccount();
  await accountPage.expectAccountDeleted();
  await accountPage.continueToHome();

  await loginPage.goto();
  await loginPage.login(email, password);

  await expect(page).toHaveURL(/\/login$/);
  await expect(loginPage.loginErrorMessage).toBeVisible();
});
