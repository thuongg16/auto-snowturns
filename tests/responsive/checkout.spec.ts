import { authTest as test } from '../../fixtures/test-fixtures';
import {
  RESPONSIVE_VIEWPORTS,
  addFirstProductToCartAndCheckout,
  buildPaymentDetails,
  expectNoHorizontalScroll,
  expectWithinViewport,
  waitForPage,
} from '../../utils/helpers';

// docs/test-cases/responsive.md — Section 1 (Happy: TC_RESP_007)
// Login is setup here, not under test, so the worker's shared session is reused (authTest).
// Each case runs once per supported viewport.

// Traces, videos and screenshots record the typed card number; keep it out of CI artifacts.
// These options are per file (they force a new worker), so they must be set at the top level.
test.use({ trace: 'off', video: 'off', screenshot: 'off' });

for (const viewport of RESPONSIVE_VIEWPORTS) {
  test.describe(`${viewport.width}px`, () => {
    test.use({ viewport });

    test('TC_RESP_007 — Checkout and payment forms can be completed', { tag: ['@critical'] }, async ({
      page,
      account,
      productsPage,
      cartPage,
      checkoutPage,
      paymentPage,
      orderConfirmationPage,
    }) => {
      // The cart is kept in the shared session; start from exactly one product.
      await cartPage.clear();
      await addFirstProductToCartAndCheckout(productsPage, cartPage);

      await expectNoHorizontalScroll(page);
      // The order table may scroll inside its box (accepted on phones); the box must fit.
      await expectWithinViewport(checkoutPage.orderReviewBox, { clickable: false });
      for (const control of [checkoutPage.commentTextarea, checkoutPage.placeOrderLink]) {
        await expectWithinViewport(control);
      }

      await checkoutPage.placeOrder();
      await waitForPage(page, '**/payment');

      await expectNoHorizontalScroll(page);
      for (const control of [
        paymentPage.nameOnCardInput,
        paymentPage.cardNumberInput,
        paymentPage.cvcInput,
        paymentPage.expiryMonthInput,
        paymentPage.expiryYearInput,
        paymentPage.payButton,
      ]) {
        await expectWithinViewport(control);
      }

      await paymentPage.pay(buildPaymentDetails(account.name));
      await waitForPage(page, '**/payment_done/**');

      await orderConfirmationPage.expectOrderPlaced();
    });
  });
}
