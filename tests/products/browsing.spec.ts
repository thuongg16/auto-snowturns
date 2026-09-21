import { test, expect } from '../../fixtures/test-fixtures';

// docs/test-cases/products.md — Section 1 (Happy: TC_PROD_001-003)

test('TC_PROD_001 — View all products on the Products page', async ({ page, homePage, productsPage }) => {
  await homePage.goto();
  await homePage.goToProducts();

  await expect(page).toHaveURL(/\/products$/);
  await expect(productsPage.productCards.first()).toBeVisible();
  await expect(page.getByText('CATEGORY')).toBeVisible();
  await expect(page.getByText('BRANDS')).toBeVisible();
});

test('TC_PROD_002 — Browse products by category', async ({ page, productsPage }) => {
  await productsPage.goto();
  await productsPage.openCategory('Women', 'Dress');

  await expect(page).toHaveURL(/\/category_products\//);
  await expect(productsPage.pageHeading).toContainText(/WOMEN.*Dress/i);
});

test('TC_PROD_003 — Browse products by brand', async ({ page, productsPage }) => {
  await productsPage.goto();
  await productsPage.openBrand('Polo');

  await expect(page).toHaveURL(/\/brand_products\/Polo/);
  await expect(productsPage.pageHeading).toContainText(/BRAND.*Polo/i);
});
