import { test, expect } from '../../fixtures/test-fixtures';

// docs/test-cases/products.md — Section 1 (Happy: TC_PROD_004), Section 2 (Negative: N01),
// Section 3 (Edge: E01)

test('TC_PROD_004 — Search for products using a valid keyword', { tag: ['@smoke', '@critical'] }, async ({ page, productsPage }) => {
  await productsPage.goto();
  await productsPage.search('Dress');

  await expect(page).toHaveURL(/\/products\?search=Dress/);
  await expect(productsPage.pageHeading).toHaveText(/searched products/i);
  await expect(productsPage.productCards.first()).toBeVisible();
});

test('TC_PROD_N01 — Search for products using a keyword with no matching results', async ({
  productsPage,
}) => {
  await productsPage.goto();
  await productsPage.search('zzzznoproduct123');

  await expect(productsPage.pageHeading).toHaveText(/searched products/i);
  await expect(productsPage.productCards).toHaveCount(0);
});

test('TC_PROD_E01 — Search using an empty search term', async ({ page, productsPage }) => {
  await productsPage.goto();
  const totalProductCount = await productsPage.productCards.count();

  await productsPage.search('');

  await expect(page).toHaveURL(/\/products\?search=$/);
  await expect(productsPage.productCards).toHaveCount(totalProductCount);
});
