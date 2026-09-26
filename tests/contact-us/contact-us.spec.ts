import { test, expect } from '../../fixtures/test-fixtures';
import { generateUniqueEmail } from '../../utils/helpers';

// docs/test-cases/contact-us.md — Section 1 (Happy: TC_CONTACT_001), Section 2 (Negative: N01),
// Section 3 (Edge: E01)

test('TC_CONTACT_001 — Submit the Contact Us form with all fields completed', { tag: ['@smoke', '@critical'] }, async ({ contactUsPage }) => {
  await contactUsPage.goto();

  await contactUsPage.submit({
    name: 'QA Contact',
    email: generateUniqueEmail('contact'),
    subject: 'Test Inquiry',
    message: 'This is a test message for the Contact Us form.',
  });

  await expect(contactUsPage.successMessage).toBeVisible();
});

test('TC_CONTACT_N01 — Attempt to submit the Contact Us form without a required email address', async ({
  contactUsPage,
}) => {
  await contactUsPage.goto();

  await contactUsPage.submit({ name: 'QA No Email' });

  await expect(contactUsPage.successMessage).toBeHidden();
  const isEmailFieldValid = await contactUsPage.emailInput.evaluate(
    (el: HTMLInputElement) => el.validity.valid,
  );
  expect(isEmailFieldValid).toBe(false);
});

test('TC_CONTACT_E01 — Submit the Contact Us form with only the required Email field completed', async ({
  contactUsPage,
}) => {
  await contactUsPage.goto();

  await contactUsPage.submit({ email: generateUniqueEmail('contact_e01') });

  await expect(contactUsPage.successMessage).toBeVisible();
});
