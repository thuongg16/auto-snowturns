import { Page, Locator, expect } from '@playwright/test';

/** The order confirmation page (`/payment_done/<id>`). */
export class OrderConfirmationPage {
  readonly page: Page;
  readonly orderPlacedHeading: Locator;
  readonly downloadInvoiceLink: Locator;
  readonly continueLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderPlacedHeading = page.getByRole('heading', { name: 'Order Placed!' });
    this.downloadInvoiceLink = page.locator('a:has-text("Download Invoice")');
    this.continueLink = page.locator('a:has-text("Continue")');
  }

  async expectOrderPlaced() {
    await expect(this.orderPlacedHeading).toBeVisible();
  }

  /** Clicks Download Invoice and waits for the resulting browser download. */
  async downloadInvoice() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadInvoiceLink.click();
    return downloadPromise;
  }
}
