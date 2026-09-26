import { test, expect } from '../../fixtures/test-fixtures';
import { addFirstProductToCartAndCheckout, generateUniqueEmail, registerNewUserViaApi } from '../../utils/helpers';

// docs/test-cases/checkout.md — Section 1 (Happy: TC_CHECKOUT_001-003), Section 2 (Negative: N01)
// All cases require an authenticated account with at least one product in the cart.

const name = 'QA Checkout';

test.beforeEach(async ({ page, loginPage, productsPage, cartPage }) => {
  // Registration isn't under test here, so the account is created via the
  // API and logged in through the UI (see registerNewUserViaApi).
  const email = generateUniqueEmail('checkout');
  await registerNewUserViaApi(page, loginPage, name, email);
  await addFirstProductToCartAndCheckout(productsPage, cartPage);
});

test('TC_CHECKOUT_001 — View checkout page with address and order details while authenticated', { tag: ['@critical'] }, async ({
  page,
  checkoutPage,
}) => {
  await expect(checkoutPage.deliveryAddressHeading).toBeVisible();
  await expect(checkoutPage.billingAddressHeading).toBeVisible();
  await expect(page.getByText(name, { exact: false }).first()).toBeVisible();
  await expect(checkoutPage.orderReviewRows).toHaveCount(1);
  await expect(checkoutPage.totalAmount).toBeVisible();
  await expect(checkoutPage.commentTextarea).toBeVisible();
  await expect(checkoutPage.placeOrderLink).toBeVisible();
});

test('TC_CHECKOUT_002 — Complete checkout with valid payment details and place an order', { tag: ['@smoke', '@critical'] }, async ({
  page,
  checkoutPage,
  paymentPage,
  orderConfirmationPage,
}) => {
  await checkoutPage.placeOrder();
  await page.waitForURL('**/payment', { waitUntil: 'domcontentloaded' });

  await paymentPage.pay({
    nameOnCard: name,
    cardNumber: '4111111111111111',
    cvc: '123',
    expiryMonth: '12',
    expiryYear: '2030',
  });
  await page.waitForURL('**/payment_done/**', { waitUntil: 'domcontentloaded' });

  await orderConfirmationPage.expectOrderPlaced();
  await expect(orderConfirmationPage.downloadInvoiceLink).toBeVisible();
  await expect(orderConfirmationPage.continueLink).toBeVisible();
});

test('TC_CHECKOUT_003 — Download invoice after placing an order', async ({
  page,
  checkoutPage,
  paymentPage,
  orderConfirmationPage,
}) => {
  await checkoutPage.placeOrder();
  await page.waitForURL('**/payment', { waitUntil: 'domcontentloaded' });
  await paymentPage.pay({
    nameOnCard: name,
    cardNumber: '4111111111111111',
    cvc: '123',
    expiryMonth: '12',
    expiryYear: '2030',
  });
  await page.waitForURL('**/payment_done/**', { waitUntil: 'domcontentloaded' });

  const download = await orderConfirmationPage.downloadInvoice();

  expect(download.suggestedFilename()).toBeTruthy();
  await expect(orderConfirmationPage.orderPlacedHeading).toBeVisible();
});

test('TC_CHECKOUT_N01 — Attempt to place an order with missing payment information', async ({
  page,
  checkoutPage,
  paymentPage,
  orderConfirmationPage,
}) => {
  await checkoutPage.placeOrder();
  await page.waitForURL('**/payment', { waitUntil: 'domcontentloaded' });

  await paymentPage.payButton.click();

  await expect(page).toHaveURL(/\/payment$/);
  await expect(orderConfirmationPage.orderPlacedHeading).toBeHidden();
});
