import { Page, Locator } from '@playwright/test';
import { AddedToCartModal } from './components/added-to-cart-modal.component';

/** The "All Products" listing page (`/products`), including search, category/brand navigation. */
export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly pageHeading: Locator;
  readonly addedToCartModal: AddedToCartModal;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.productCards = page.locator('.product-image-wrapper');
    this.pageHeading = page.locator('.title.text-center').first();
    this.addedToCartModal = new AddedToCartModal(page);
  }

  async goto() {
    await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  /** Expands a top-level category and follows one of its subcategory links. */
  async openCategory(category: string, subcategory: string) {
    await this.page.locator('a', { hasText: category }).first().click();
    await this.page.locator('a', { hasText: subcategory }).first().click();
  }

  async openBrand(brand: string) {
    await this.page.locator('a', { hasText: brand }).first().click();
  }

  async viewProduct(index = 0) {
    await this.productCards.nth(index).locator('a:has-text("View Product")').click();
  }

  async addProductToCart(index = 0) {
    const card = this.productCards.nth(index);
    await card.hover();
    await card.locator('a:has-text("Add to cart")').first().click();
    await this.addedToCartModal.waitUntilVisible();
  }
}
