import { test, expect } from '../../fixtures/test-fixtures';
import {
  RESPONSIVE_VIEWPORTS,
  buildApiAccountPayload,
  expectNoHorizontalScroll,
  expectWithinViewport,
  generateUniqueEmail,
  getNewUserDetails,
} from '../../utils/helpers';

// docs/test-cases/responsive.md — Section 1 (Happy: TC_RESP_005, 006, 008-011), Section 2 (Negative: N01)
// Each case runs once per supported viewport. TC_RESP_007 (checkout) is in checkout.spec.ts.

for (const viewport of RESPONSIVE_VIEWPORTS) {
  test.describe(`${viewport.width}px`, () => {
    test.use({ viewport });

    test('TC_RESP_005 — Login form can be filled and submitted', { tag: ['@critical'] }, async ({
      request,
      homePage,
      loginPage,
    }) => {
      // Registration is not under test: create the account via the API, stay logged out.
      const account = buildApiAccountPayload(generateUniqueEmail('resp_login'));
      await request.post('/api/createAccount', { form: account });

      await loginPage.goto();
      for (const control of [loginPage.loginEmailInput, loginPage.loginPasswordInput, loginPage.loginButton]) {
        await expectWithinViewport(control);
      }

      await loginPage.login(account.email, account.password);
      await homePage.expectLoggedInAs(account.name);
    });

    test('TC_RESP_006 — Signup and account information forms can be completed', { tag: ['@critical'] }, async ({
      page,
      loginPage,
      accountPage,
    }) => {
      await loginPage.goto();
      for (const control of [loginPage.signupNameInput, loginPage.signupEmailInput, loginPage.signupButton]) {
        await expectWithinViewport(control);
      }

      await loginPage.startSignup('QA Responsive', generateUniqueEmail('resp_signup'));
      await expect(page).toHaveURL(/\/signup$/);

      for (const control of [
        accountPage.passwordInput,
        accountPage.dayOfBirthSelect,
        accountPage.monthOfBirthSelect,
        accountPage.yearOfBirthSelect,
        accountPage.firstNameInput,
        accountPage.lastNameInput,
        accountPage.address1Input,
        accountPage.countrySelect,
        accountPage.stateInput,
        accountPage.cityInput,
        accountPage.zipcodeInput,
        accountPage.mobileNumberInput,
        accountPage.createAccountButton,
      ]) {
        await expectWithinViewport(control);
      }
      await expectNoHorizontalScroll(page);

      await accountPage.createAccount(getNewUserDetails());
      await accountPage.expectAccountCreated();
    });

    test('TC_RESP_N01 — Login error message is readable within the viewport', async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.login(generateUniqueEmail('resp_n01'), 'WrongPass123!');

      await expectWithinViewport(loginPage.loginErrorMessage, { clickable: false });
      await expect(page).toHaveURL(/\/login$/);
    });

    test('TC_RESP_008 — Product search form can be used', async ({ productsPage }) => {
      await productsPage.goto();
      await expectWithinViewport(productsPage.searchInput);
      await expectWithinViewport(productsPage.searchButton);

      await productsPage.search('Top');

      await expect(productsPage.pageHeading).toHaveText(/searched products/i);
      await expect(productsPage.productCards.first()).toBeVisible();
    });

    test('TC_RESP_009 — Newsletter subscription form can be used', async ({ homePage }) => {
      await homePage.goto();
      await expectWithinViewport(homePage.subscription.emailInput);
      await expectWithinViewport(homePage.subscription.subscribeButton);

      await homePage.subscription.subscribe(generateUniqueEmail('resp_news'));

      await expect(homePage.subscription.successMessage).toHaveText('You have been successfully subscribed!');
      await expectWithinViewport(homePage.subscription.successMessage, { clickable: false });
    });

    test('TC_RESP_010 — Contact Us form can be filled and submitted', async ({ contactUsPage }) => {
      await contactUsPage.goto();
      for (const control of [
        contactUsPage.nameInput,
        contactUsPage.emailInput,
        contactUsPage.subjectInput,
        contactUsPage.messageInput,
        contactUsPage.submitButton,
      ]) {
        await expectWithinViewport(control);
      }

      await contactUsPage.submit({
        name: 'QA Responsive',
        email: generateUniqueEmail('resp_contact'),
        subject: 'Responsive check',
        message: `Layout test at ${viewport.width}px`,
      });

      await expect(contactUsPage.successMessage).toBeVisible();
    });

    test('TC_RESP_011 — Product review form can be filled and submitted', async ({ productDetailPage }) => {
      await productDetailPage.goto(1);
      await expectWithinViewport(productDetailPage.writeReviewTab);
      await productDetailPage.writeReviewTab.click();
      for (const control of [
        productDetailPage.reviewNameInput,
        productDetailPage.reviewEmailInput,
        productDetailPage.reviewTextInput,
        productDetailPage.reviewSubmitButton,
      ]) {
        await expectWithinViewport(control);
      }

      await productDetailPage.submitReview({
        name: 'QA Responsive',
        email: generateUniqueEmail('resp_review'),
        review: 'Responsive review',
      });

      await expect(productDetailPage.reviewSuccessMessage).toBeVisible();
    });
  });
}
