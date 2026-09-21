import { Page, Locator, expect } from '@playwright/test';

/** Fields collected on the account information step (`/signup`). */
export type NewUserDetails = {
  title: 'Mr' | 'Mrs';
  password: string;
  day: string;
  month: string;
  year: string;
  firstName: string;
  lastName: string;
  address1: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
};

/**
 * Covers the authenticated account lifecycle pages needed for
 * Authentication test cases: the account information form (`/signup`),
 * the account creation confirmation (`/account_created`), and the
 * account deletion confirmation (`/delete_account`). Triggering
 * logout/delete navigation is HomePage's responsibility.
 */
export class AccountPage {
  readonly page: Page;

  // readonly titleRadio: Locator;
  readonly passwordInput: Locator;
  readonly dayOfBirthSelect: Locator;
  readonly monthOfBirthSelect: Locator;
  readonly yearOfBirthSelect: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly address1Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;

  readonly accountCreatedHeading: Locator;
  readonly accountDeletedHeading: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // this.titleRadio = page.locator('#id_gender1');
    this.passwordInput = page.locator('[data-qa="password"]');
    this.dayOfBirthSelect = page.locator('[data-qa="days"]');
    this.monthOfBirthSelect = page.locator('[data-qa="months"]');
    this.yearOfBirthSelect = page.locator('[data-qa="years"]');
    this.firstNameInput = page.locator('[data-qa="first_name"]');
    this.lastNameInput = page.locator('[data-qa="last_name"]');
    this.address1Input = page.locator('[data-qa="address"]');
    this.countrySelect = page.locator('[data-qa="country"]');
    this.stateInput = page.locator('[data-qa="state"]');
    this.cityInput = page.locator('[data-qa="city"]');
    this.zipcodeInput = page.locator('[data-qa="zipcode"]');
    this.mobileNumberInput = page.locator('[data-qa="mobile_number"]');
    this.createAccountButton = page.locator('[data-qa="create-account"]');

    this.accountCreatedHeading = page.getByRole('heading', { name: 'ACCOUNT CREATED!' });
    this.accountDeletedHeading = page.getByRole('heading', { name: 'ACCOUNT DELETED!' });
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  /** Fills the account information form (`/signup`); does not submit. */
  async fillAccountDetails(details: NewUserDetails) {
    await this.page.locator(`#id_gender${details.title === 'Mr' ? '1' : '2'}`).check();
    await this.passwordInput.fill(details.password);
    await this.dayOfBirthSelect.selectOption(details.day);
    await this.monthOfBirthSelect.selectOption(details.month);
    await this.yearOfBirthSelect.selectOption(details.year);
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.address1Input.fill(details.address1);
    await this.countrySelect.selectOption(details.country);
    await this.stateInput.fill(details.state);
    await this.cityInput.fill(details.city);
    await this.zipcodeInput.fill(details.zipcode);
    await this.mobileNumberInput.fill(details.mobileNumber);
  }

  /** Fills the account information form and submits it. */
  async createAccount(details: NewUserDetails) {
    await this.fillAccountDetails(details);
    await this.createAccountButton.click();
  }

  async expectAccountCreated() {
    await expect(this.accountCreatedHeading).toBeVisible();
  }

  async expectAccountDeleted() {
    await expect(this.accountDeletedHeading).toBeVisible();
  }

  /** Used on both the account-created and account-deleted confirmation pages. */
  async continueToHome() {
    await this.continueButton.click();
  }
}
