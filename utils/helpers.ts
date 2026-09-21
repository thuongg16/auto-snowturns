import { Page } from '@playwright/test';
import usersData from '../test-data/users.json';
import { AccountPage, NewUserDetails } from '../src/pages/account.page';
import { LoginPage } from '../src/pages/login.page';
import { ProductsPage } from '../src/pages/products.page';
import { CartPage } from '../src/pages/cart.page';

/**
 * Generates a unique, clearly fictional email address for registration
 * tests, avoiding "email already exists" collisions across test runs.
 */
export function generateUniqueEmail(prefix = 'qa_test'): string {
  const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 10_000)}`;
  return `${prefix}_${uniqueId}@example.com`;
}

/**
 * Builds a valid, reusable account information payload from the static
 * test data (`test-data/users.json`), for tests that need a registered
 * account but don't care about specific field values.
 */
export function getNewUserDetails(): NewUserDetails {
  const { name, ...accountFields } = usersData.newUser;
  return { ...accountFields, title: 'Mr' };
}

/**
 * Registers a brand-new account via the UI (signup step + account
 * information form) and leaves the browser on the authenticated home
 * page. Used by tests whose precondition is "a registered account exists".
 */
export async function registerNewUser(
  loginPage: LoginPage,
  accountPage: AccountPage,
  name: string,
  email: string,
  details: NewUserDetails = getNewUserDetails(),
) {
  await loginPage.goto();
  await loginPage.startSignup(name, email);
  await accountPage.createAccount(details);
  await accountPage.expectAccountCreated();
  await accountPage.continueToHome();
}

/**
 * Adds the first listed product to the cart and proceeds to the checkout
 * page. Used by checkout tests, all of which start from this same state.
 */
export async function addFirstProductToCartAndCheckout(productsPage: ProductsPage, cartPage: CartPage) {
  await productsPage.goto();
  await productsPage.addProductToCart(0);
  await productsPage.addedToCartModal.goToCart();
  await cartPage.proceedToCheckout();
  await productsPage.page.waitForURL('**/checkout', { waitUntil: 'domcontentloaded' });
}

/**
 * Builds a complete `createAccount`/`updateAccount` API payload from the
 * static test data, mapped to the API's field names (which differ from the
 * UI form's, e.g. `firstname` vs `firstName`).
 */
export function buildApiAccountPayload(email: string) {
  const u = usersData.newUser;
  return {
    name: u.name,
    email,
    password: u.password,
    title: u.title,
    birth_date: u.day,
    birth_month: u.month,
    birth_year: u.year,
    firstname: u.firstName,
    lastname: u.lastName,
    company: 'Test Company',
    address1: u.address1,
    address2: '',
    country: u.country,
    zipcode: u.zipcode,
    state: u.state,
    city: u.city,
    mobile_number: u.mobileNumber,
  };
}

/**
 * Creates a new account via the API (fast, and avoids the ad-heavy account
 * information form) and logs in through the UI, leaving the browser on an
 * authenticated home page. Use this instead of `registerNewUser` in tests
 * where registration itself isn't the behavior under test.
 */
export async function registerNewUserViaApi(page: Page, loginPage: LoginPage, name: string, email: string) {
  const payload = { ...buildApiAccountPayload(email), name };
  await page.request.post('/api/createAccount', { form: payload });

  await loginPage.goto();
  await loginPage.login(email, payload.password);

  return payload;
}
