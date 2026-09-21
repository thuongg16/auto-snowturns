import { Page, Locator } from '@playwright/test';

/**
 * Represents the "Signup / Login" page (`/login`), which hosts two
 * independent forms: an existing-user login form and a new-user
 * signup form (name + email only — the rest is collected on the
 * account information step, see AccountPage).
 */
export class LoginPage {
  readonly page: Page;

  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;

  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly signupErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loginEmailInput = page.locator('[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.loginErrorMessage = page.getByText('Your email or password is incorrect!');

    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    this.signupErrorMessage = page.getByText('Email Address already exist!');
  }

  async goto() {
    // 'domcontentloaded' avoids waiting on slow third-party ad resources
    // that can keep the 'load' event from firing on this page.
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
  }

  async login(email: string, password: string) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }

  async startSignup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }
}
