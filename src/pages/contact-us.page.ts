import { Page, Locator } from '@playwright/test';

export type ContactDetails = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

/** The Contact Us page (`/contact_us`). */
export class ContactUsPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.subjectInput = page.locator('input[name="subject"]');
    this.messageInput = page.locator('textarea[name="message"]');
    this.submitButton = page.locator('input[name="submit"]');
    // Scoped to #contact-page: the page also contains a hidden #success-subscribe
    // element (the newsletter widget's template) with this same success text.
    this.successMessage = page
      .locator('#contact-page')
      .getByText('Success! Your details have been submitted successfully.');
  }

  async goto() {
    await this.page.goto('/contact_us', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Fills the fields present in `details` and submits. Submission (when it
   * succeeds) triggers a native "Press OK to proceed!" confirm dialog, which
   * this accepts automatically.
   */
  async submit(details: ContactDetails) {
    if (details.name) await this.nameInput.fill(details.name);
    if (details.email) await this.emailInput.fill(details.email);
    if (details.subject) await this.subjectInput.fill(details.subject);
    if (details.message) await this.messageInput.fill(details.message);

    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitButton.click();
  }
}
