import { test, expect } from '../../fixtures/test-fixtures';

// docs/test-cases/cart.md — Section 1 (Happy: TC_CART_001-004), Section 2 (Negative: N01)

test('TC_CART_001 — View an empty cart', async ({ homePage, cartPage }) => {
  await homePage.goto();
  await homePage.goToCart();

  await expect(cartPage.emptyCartMessage).toBeVisible();
});

test('TC_CART_002 — Add products to the cart and view cart contents', async ({ productsPage, cartPage }) => {
  await productsPage.goto();
  await productsPage.addProductToCart(0);
  await productsPage.addedToCartModal.continueShopping();

  await productsPage.addProductToCart(1);
  await productsPage.addedToCartModal.continueShopping();

  await productsPage.addProductToCart(2);
  await productsPage.addedToCartModal.goToCart();


  await expect(cartPage.cartRows).toHaveCount(3);
});

test('TC_CART_003 — Cart contents persist across page navigation', async ({
  homePage,
  productsPage,
  cartPage,
}) => {
  await productsPage.goto();
  await productsPage.addProductToCart(0);
  await productsPage.addedToCartModal.continueShopping();

  await homePage.goto();
  await cartPage.goto();

  await expect(cartPage.cartRows).toHaveCount(1);
});

test('TC_CART_004 — Remove a product from the cart', async ({ productsPage, cartPage }) => {
  await productsPage.goto();
  await productsPage.addProductToCart(0);
  await productsPage.addedToCartModal.continueShopping();
  await productsPage.addProductToCart(1);
  await productsPage.addedToCartModal.goToCart();
  await expect(cartPage.cartRows).toHaveCount(2);

  await cartPage.removeProduct(0);

  await expect(cartPage.cartRows).toHaveCount(1);
});

test('TC_CART_N01 — Attempt to proceed to checkout while not logged in', async ({
  page,
  productsPage,
  cartPage,
}) => {
  await productsPage.goto();
  await productsPage.addProductToCart(0);
  await productsPage.addedToCartModal.goToCart();

  await cartPage.proceedToCheckout();

  await expect(page).toHaveURL(/\/view_cart$/);
  await expect(cartPage.checkoutLoginGateMessage).toBeVisible();
  await expect(cartPage.checkoutLoginGateLink).toBeVisible();
  await expect(cartPage.cartRows).toHaveCount(1);
});
