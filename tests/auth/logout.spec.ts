import { test, expect } from '../../fixtures/test-fixtures';
import { generateUniqueEmail, registerNewUserViaApi } from '../../utils/helpers';

// docs/test-cases/auth.md — Section 1 (Happy: TC_AUTH_003)

test('TC_AUTH_003 — Logout from an authenticated session', async ({ page, homePage, loginPage }) => {
  // Registration isn't under test here, so the account is created via the
  // API and logged in through the UI (see registerNewUserViaApi).
  const email = generateUniqueEmail('auth_tc003');
  await registerNewUserViaApi(page, loginPage, 'QA Logout Test', email);

  await homePage.logout();

  await expect(page).toHaveURL(/\/login$/);
  await homePage.expectLoggedOut();
  await expect(loginPage.loginEmailInput).toBeVisible();
  await expect(loginPage.loginPasswordInput).toBeVisible();
});
