import { test, expect } from '../../fixtures/test-fixtures';
import { generateUniqueEmail } from '../../utils/helpers';

// docs/test-cases/newsletter.md — Section 1 (Happy: TC_NEWS_001-002), Section 2 (Negative: N01)

test('TC_NEWS_001 — Subscribe to the newsletter with a valid email on the home page', async ({
  homePage,
}) => {
  await homePage.goto();
  await homePage.subscription.subscribe(generateUniqueEmail('news_home'));

  await expect(homePage.subscription.successMessage).toHaveText('You have been successfully subscribed!');
});

test('TC_NEWS_002 — Subscribe to the newsletter with a valid email on the cart page', async ({
  cartPage,
}) => {
  await cartPage.goto();
  await cartPage.subscription.subscribe(generateUniqueEmail('news_cart'));

  await expect(cartPage.subscription.successMessage).toHaveText('You have been successfully subscribed!');
});

test('TC_NEWS_N01 — Attempt to subscribe with an invalid email format', async ({ homePage }) => {
  await homePage.goto();
  await homePage.subscription.subscribe('not-an-email');

  await expect(homePage.subscription.successMessage).toBeHidden();
  const isEmailFieldValid = await homePage.subscription.emailInput.evaluate(
    (el: HTMLInputElement) => el.validity.valid,
  );
  expect(isEmailFieldValid).toBe(false);
});
