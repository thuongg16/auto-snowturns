import { Page, Locator } from '@playwright/test';

/** The checkout page (`/checkout`): delivery/billing address and order review. */
export class CheckoutPage {
  readonly page: Page;
  readonly deliveryAddressHeading: Locator;
  readonly billingAddressHeading: Locator;
  readonly orderReviewRows: Locator;
  readonly totalAmount: Locator;
  readonly commentTextarea: Locator;
  readonly placeOrderLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.deliveryAddressHeading = page.getByText('YOUR DELIVERY ADDRESS');
    this.billingAddressHeading = page.getByText('YOUR BILLING ADDRESS');
    // Scoped to rows with a product id: the same table also contains a
    // trailing "Total Amount" summary row with no product id.
    this.orderReviewRows = page.locator('#cart_info tbody tr[id^="product-"]');
    this.totalAmount = page.getByText('Total Amount');
    this.commentTextarea = page.locator('textarea[name="message"]');
    this.placeOrderLink = page.locator('a:has-text("Place Order")');
  }

  async placeOrder(comment?: string) {
    if (comment) {
      await this.commentTextarea.fill(comment);
    }
    await this.placeOrderLink.click();
  }
}
