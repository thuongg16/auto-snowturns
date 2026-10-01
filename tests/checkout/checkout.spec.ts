import { authTest as test, expect } from '../../fixtures/test-fixtures';
import { addFirstProductToCartAndCheckout, buildPaymentDetails, waitForPage } from '../../utils/helpers';

// docs/test-cases/checkout.md — Section 1 (Happy: TC_CHECKOUT_001-003), Section 2 (Negative: N01)
// All cases require an authenticated account with exactly one product in the cart.
// Login is setup here, not under test, so the worker's shared session is reused (authTest).

// Traces, videos and screenshots record the typed card number; keep it out of CI artifacts.
// These options are per file (they force a new worker), so they cover every case here.
test.use({ trace: 'off', video: 'off', screenshot: 'off' });

test.beforeEach(async ({ productsPage, cartPage }) => {
  // The cart is kept in the shared session; empty it so each test starts from one product.
  await cartPage.clear();
  await addFirstProductToCartAndCheckout(productsPage, cartPage);
});

test('TC_CHECKOUT_001 — View checkout page with address and order details while authenticated', { tag: ['@critical'] }, async ({
  page,
  account,
  checkoutPage,
}) => {
  await expect(checkoutPage.deliveryAddressHeading).toBeVisible();
  await expect(checkoutPage.billingAddressHeading).toBeVisible();
  await expect(page.getByText(account.name, { exact: false }).first()).toBeVisible();
  await expect(checkoutPage.orderReviewRows).toHaveCount(1);
  await expect(checkoutPage.totalAmount).toBeVisible();
  await expect(checkoutPage.commentTextarea).toBeVisible();
  await expect(checkoutPage.placeOrderLink).toBeVisible();
});

test('TC_CHECKOUT_002 — Complete checkout with valid payment details and place an order', { tag: ['@smoke', '@critical'] }, async ({
  page,
  account,
  checkoutPage,
  paymentPage,
  orderConfirmationPage,
}) => {
  await checkoutPage.placeOrder();
  await waitForPage(page, '**/payment');

  await paymentPage.pay(buildPaymentDetails(account.name));
  await waitForPage(page, '**/payment_done/**');

  await orderConfirmationPage.expectOrderPlaced();
  await expect(orderConfirmationPage.downloadInvoiceLink).toBeVisible();
  await expect(orderConfirmationPage.continueLink).toBeVisible();
});

test('TC_CHECKOUT_003 — Download invoice after placing an order', async ({
  page,
  account,
  checkoutPage,
  paymentPage,
  orderConfirmationPage,
}) => {
  await checkoutPage.placeOrder();
  await waitForPage(page, '**/payment');
  await paymentPage.pay(buildPaymentDetails(account.name));
  await waitForPage(page, '**/payment_done/**');

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
  await waitForPage(page, '**/payment');

  await paymentPage.payButton.click();

  await expect(page).toHaveURL(/\/payment$/);
  await expect(orderConfirmationPage.orderPlacedHeading).toBeHidden();
});
