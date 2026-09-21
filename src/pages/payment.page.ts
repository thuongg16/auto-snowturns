import { Page, Locator } from '@playwright/test';

export type PaymentDetails = {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
};

/** The payment page (`/payment`); no real payment is processed. */
export class PaymentPage {
  readonly page: Page;
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payButton = page.locator('[data-qa="pay-button"]');
  }

  /** Fills the payment fields present in `details`; leaves the rest untouched. */
  async fillPaymentDetails(details: Partial<PaymentDetails>) {
    if (details.nameOnCard) await this.nameOnCardInput.fill(details.nameOnCard);
    if (details.cardNumber) await this.cardNumberInput.fill(details.cardNumber);
    if (details.cvc) await this.cvcInput.fill(details.cvc);
    if (details.expiryMonth) await this.expiryMonthInput.fill(details.expiryMonth);
    if (details.expiryYear) await this.expiryYearInput.fill(details.expiryYear);
  }

  async pay(details: Partial<PaymentDetails> = {}) {
    await this.fillPaymentDetails(details);
    await this.payButton.click();
  }
}
