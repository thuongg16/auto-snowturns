import { Page, Locator } from '@playwright/test';
import { AddedToCartModal } from './components/added-to-cart-modal.component';

/** A single product detail page (`/product_details/<id>`), including the review form. */
export class ProductDetailPage {
  readonly page: Page;
  readonly productInfo: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly addedToCartModal: AddedToCartModal;

  readonly writeReviewTab: Locator;
  readonly reviewNameInput: Locator;
  readonly reviewEmailInput: Locator;
  readonly reviewTextInput: Locator;
  readonly reviewSubmitButton: Locator;
  readonly reviewSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productInfo = page.locator('.product-information');
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = this.productInfo.locator('button:has-text("Add to cart")');
    this.addedToCartModal = new AddedToCartModal(page);

    this.writeReviewTab = page.locator('a:has-text("Write Your Review")');
    this.reviewNameInput = page.locator('#name');
    this.reviewEmailInput = page.locator('#email');
    this.reviewTextInput = page.locator('textarea#review');
    this.reviewSubmitButton = page.locator('#button-review');
    this.reviewSuccessMessage = page.getByText('Thank you for your review.');
  }

  async addToCart(quantity?: string) {
    if (quantity) {
      await this.quantityInput.fill(quantity);
    }
    await this.addToCartButton.click();
    await this.addedToCartModal.waitUntilVisible();
  }

  /** Fills and submits the review form; does not assume all fields are required. */
  async submitReview({ name, email, review }: { name?: string; email?: string; review?: string }) {
    await this.writeReviewTab.click();
    if (name) await this.reviewNameInput.fill(name);
    if (email) await this.reviewEmailInput.fill(email);
    if (review) await this.reviewTextInput.fill(review);
    await this.reviewSubmitButton.click();
  }
}
