import { Page, Locator } from '@playwright/test';
import { SubscriptionForm } from './components/subscription.component';

/** The shopping cart page (`/view_cart`). */
export class CartPage {
  readonly page: Page;
  readonly emptyCartMessage: Locator;
  readonly cartRows: Locator;
  readonly proceedToCheckoutLink: Locator;
  readonly subscription: SubscriptionForm;

  /** The "Register / Login account to proceed on checkout." gate shown to guests. */
  readonly checkoutLoginGate: Locator;
  readonly checkoutLoginGateMessage: Locator;
  readonly checkoutLoginGateLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyCartMessage = page.getByText('Cart is empty! Click here to buy products.');
    this.cartRows = page.locator('#cart_info tbody tr');
    this.proceedToCheckoutLink = page.locator('a:has-text("Proceed To Checkout")');
    this.subscription = new SubscriptionForm(page);

    this.checkoutLoginGate = page.locator('.modal-content:visible');
    this.checkoutLoginGateMessage = this.checkoutLoginGate.getByText(
      'Register / Login account to proceed on checkout.',
    );
    this.checkoutLoginGateLink = this.checkoutLoginGate.getByRole('link', { name: 'Register / Login' });
  }

  async goto() {
    await this.page.goto('/view_cart', { waitUntil: 'domcontentloaded' });
  }

  async removeProduct(index = 0) {
    await this.cartRows.nth(index).locator('.cart_quantity_delete').click();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutLink.click();
  }

  rowForProduct(name: string) {
    return this.cartRows.filter({ hasText: name });
  }
}
