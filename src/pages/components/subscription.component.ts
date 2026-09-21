import { Page, Locator } from '@playwright/test';

/** The newsletter subscription widget present on both the home and cart pages. */
export class SubscriptionForm {
  readonly emailInput: Locator;
  readonly subscribeButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.emailInput = page.locator('#susbscribe_email');
    this.subscribeButton = page.locator('#subscribe');
    this.successMessage = page.locator('.alert-success');
  }

  async subscribe(email: string) {
    await this.emailInput.fill(email);
    await this.subscribeButton.click();
  }
}
