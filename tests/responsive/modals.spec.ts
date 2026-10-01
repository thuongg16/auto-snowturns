import { test, expect } from '../../fixtures/test-fixtures';
import { RESPONSIVE_VIEWPORTS, expectWithinViewport, waitForPage } from '../../utils/helpers';

// docs/test-cases/responsive.md — Section 1 (Happy: TC_RESP_012-014)
// Each case runs once per supported viewport, as a guest with an empty cart.

for (const viewport of RESPONSIVE_VIEWPORTS) {
  test.describe(`${viewport.width}px`, () => {
    test.use({ viewport });

    test('TC_RESP_012 — "Added to cart" modal fits the viewport and "View Cart" opens the cart', { tag: ['@critical'] }, async ({
      page,
      productsPage,
      cartPage,
    }) => {
      await productsPage.goto();
      await productsPage.addProductToCart(0);

      const modal = productsPage.addedToCartModal;
      await expectWithinViewport(modal.container, { clickable: false });
      await expectWithinViewport(modal.viewCartLink);

      await modal.goToCart();
      await waitForPage(page, /\/view_cart$/);
      await expect(cartPage.cartRows).toHaveCount(1);
    });

    test('TC_RESP_013 — "Added to cart" modal "Continue Shopping" closes the modal', { tag: ['@critical'] }, async ({
      page,
      productsPage,
    }) => {
      await productsPage.goto();
      await productsPage.addProductToCart(0);

      const modal = productsPage.addedToCartModal;
      await expectWithinViewport(modal.continueShoppingLink);

      await modal.continueShopping();
      await expect(modal.container).toBeHidden();
      await expect(page).toHaveURL(/\/products$/);
    });

    test('TC_RESP_014 — Checkout login gate modal fits the viewport and its link opens the login page', async ({
      page,
      productsPage,
      cartPage,
    }) => {
      await productsPage.goto();
      await productsPage.addProductToCart(0);
      // Open the cart directly: the "Added to cart" modal itself is covered by TC_RESP_012.
      await cartPage.goto();
      await cartPage.proceedToCheckout();

      await expectWithinViewport(cartPage.checkoutLoginGate, { clickable: false });
      await expectWithinViewport(cartPage.checkoutLoginGateLink);

      await cartPage.checkoutLoginGateLink.click();
      await waitForPage(page, /\/login$/);
    });
  });
}
