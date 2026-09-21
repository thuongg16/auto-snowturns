import { Page, Locator } from '@playwright/test';

/**
 * The "Added!" confirmation overlay shown after any "Add to cart" action,
 * on both the product listing and product detail pages.
 */
export class AddedToCartModal {
  readonly container: Locator;
  readonly viewCartLink: Locator;
  readonly continueShoppingLink: Locator;

  constructor(page: Page) {
    this.container = page.locator('.modal-content:visible');
    this.viewCartLink = this.container.getByText('View Cart');
    this.continueShoppingLink = this.container.getByText('Continue Shopping');
  }

  async waitUntilVisible() {
    await this.container.waitFor({ state: 'visible' });
  }

  async goToCart() {
    await this.viewCartLink.click();
  }

  async continueShopping() {
    await this.continueShoppingLink.click();
  }
}
