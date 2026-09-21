import { Page, Locator, expect } from '@playwright/test';
import { SubscriptionForm } from './components/subscription.component';

/**
 * Represents the site header/navigation, available on every page.
 * Covers the elements needed by the Authentication flows: entry point
 * to Signup/Login, Logout, Delete Account, and the logged-in indicator.
 */
export class HomePage {
  readonly page: Page;
  readonly signupLoginLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly loggedInIndicator: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly subscription: SubscriptionForm;

  constructor(page: Page) {
    this.page = page;
    // Scoped to the nav bar: the site's "Added to cart" modal (present in the
    // DOM even when hidden) also contains a /view_cart link, which would
    // otherwise collide with these locators.
    const nav = page.locator('.shop-menu');
    this.signupLoginLink = nav.locator('a[href="/login"]');
    this.logoutLink = nav.locator('a[href="/logout"]');
    this.deleteAccountLink = nav.locator('a[href="/delete_account"]');
    this.loggedInIndicator = nav.getByText(/Logged in as/);
    this.productsLink = nav.locator('a[href="/products"]');
    this.cartLink = nav.locator('a[href="/view_cart"]');
    this.subscription = new SubscriptionForm(page);
  }

  async goto() {
    // 'domcontentloaded' avoids waiting on slow third-party ad resources
    // that can keep the 'load' event from firing on this page.
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async goToSignupLogin() {
    await this.signupLoginLink.click();
  }

  async logout() {
    await this.logoutLink.click();
  }

  async goToDeleteAccount() {
    await this.deleteAccountLink.click();
  }

  async goToProducts() {
    await this.productsLink.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async expectLoggedInAs(name: string) {
    await expect(this.loggedInIndicator).toHaveText(`Logged in as ${name}`);
  }

  async expectLoggedOut() {
    await expect(this.signupLoginLink).toBeVisible();
    await expect(this.logoutLink).toBeHidden();
    await expect(this.deleteAccountLink).toBeHidden();
    await expect(this.loggedInIndicator).toBeHidden();
  }
}
