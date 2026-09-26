import { test, expect } from '../../fixtures/test-fixtures';
import { generateUniqueEmail } from '../../utils/helpers';

// docs/test-cases/products.md — Section 1 (Happy: TC_PROD_005-007), Section 2 (Negative: N02)

test('TC_PROD_005 — View individual product detail information', { tag: ['@critical'] }, async ({
  page,
  productsPage,
  productDetailPage,
}) => {
  await productsPage.goto();
  await productsPage.viewProduct(0);

  await expect(page).toHaveURL(/\/product_details\/\d+/);
  await expect(productDetailPage.productInfo).toContainText('Category:');
  await expect(productDetailPage.productInfo).toContainText('Availability:');
  await expect(productDetailPage.productInfo).toContainText('Condition:');
  await expect(productDetailPage.productInfo).toContainText('Brand:');
  await expect(productDetailPage.quantityInput).toBeVisible();
  await expect(productDetailPage.addToCartButton).toBeVisible();
});

test('TC_PROD_006 — Add a product to the cart with a specified quantity from the detail page', { tag: ['@critical'] }, async ({
  productsPage,
  productDetailPage,
}) => {
  await productsPage.goto();
  await productsPage.viewProduct(0);

  await productDetailPage.addToCart('4');

  await expect(productDetailPage.addedToCartModal.container).toContainText('Added!');
  await expect(productDetailPage.addedToCartModal.container).toContainText(
    'Your product has been added to cart.',
  );
  await expect(productDetailPage.addedToCartModal.viewCartLink).toBeVisible();
  await expect(productDetailPage.addedToCartModal.continueShoppingLink).toBeVisible();
});

test('TC_PROD_007 — Submit a product review with valid information', async ({
  productsPage,
  productDetailPage,
}) => {
  await productsPage.goto();
  await productsPage.viewProduct(0);

  await productDetailPage.submitReview({
    name: 'QA Reviewer',
    email: generateUniqueEmail('prod_review'),
    review: 'This is a great product for testing purposes.',
  });

  await expect(productDetailPage.reviewSuccessMessage).toBeVisible();
});

test('TC_PROD_N02 — Submit a product review with missing required information', async ({
  productsPage,
  productDetailPage,
}) => {
  await productsPage.goto();
  await productsPage.viewProduct(0);

  await productDetailPage.writeReviewTab.click();
  await productDetailPage.reviewSubmitButton.click();

  await expect(productDetailPage.reviewSuccessMessage).toBeHidden();
});
