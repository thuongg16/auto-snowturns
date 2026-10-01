import { randomBytes, randomInt } from 'node:crypto';
import { Page, Locator, expect } from '@playwright/test';
import usersData from '../test-data/users.json';
import { AccountPage, NewUserDetails } from '../src/pages/account.page';
import { LoginPage } from '../src/pages/login.page';
import { ProductsPage } from '../src/pages/products.page';
import { CartPage } from '../src/pages/cart.page';
import { PaymentDetails } from '../src/pages/payment.page';

/**
 * Generates a unique, clearly fictional email address for registration
 * tests, avoiding "email already exists" collisions across test runs.
 */
export function generateUniqueEmail(prefix = 'qa_test'): string {
  const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 10_000)}`;
  return `${prefix}_${uniqueId}@example.com`;
}

/**
 * Generates a random password for a test account, so no credential is kept in
 * the repo. Tests read it back from the payload/account they created.
 */
export function generatePassword(): string {
  return `Qa-${randomBytes(9).toString('base64url')}1!`;
}

/**
 * Builds payment details for the (non-processing) payment form. The card number
 * comes from the `TEST_CARD_NUMBER` secret (`.env` locally, CI credentials in
 * Jenkins/GitHub), never from code; CVC and a future expiry date are generated.
 */
export function buildPaymentDetails(nameOnCard: string): PaymentDetails {
  const cardNumber = process.env.TEST_CARD_NUMBER;
  if (!cardNumber) {
    throw new Error('TEST_CARD_NUMBER is not set: add it to .env (see .env.example) or to the CI secrets.');
  }
  return {
    nameOnCard,
    cardNumber,
    cvc: String(randomInt(100, 1000)),
    expiryMonth: String(randomInt(1, 13)).padStart(2, '0'),
    expiryYear: String(new Date().getFullYear() + randomInt(1, 6)),
  };
}

/**
 * Builds a valid, reusable account information payload from the static
 * test data (`test-data/users.json`) plus a generated password, for tests
 * that need a registered account but don't care about specific field values.
 */
export function getNewUserDetails(): NewUserDetails {
  const { name, ...accountFields } = usersData.newUser;
  return { ...accountFields, title: 'Mr', password: generatePassword() };
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
  await waitForPage(productsPage.page, '**/checkout');
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
    password: generatePassword(),
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
  // Wait for the logged-in home page: callers (and `authTest`'s storageState) rely on
  // the session existing, and a "queue full" response to the login stays on /login.
  await waitForPage(page, /^https?:\/\/[^/]+\/?$/);

  return payload;
}

/**
 * Google ads that cover the page. They are closed, not blocked (see the NOTE in
 * fixtures/test-fixtures.ts for why network blocking was reverted):
 * - vignette: full-screen interstitial that can appear on a link navigation
 *   (the URL gets `#google_vignette`); closed with its "Close" button.
 * - anchor: banner fixed to the top of the screen on mobile/tablet; collapsed with its
 *   handle, or removed (this element only) when collapsing does not work.
 */
const AD_VIGNETTE = 'ins.adsbygoogle[data-vignette-loaded="true"]';
const AD_ANCHOR = 'ins.adsbygoogle[data-anchor-status="displayed"]';

async function closeVignette(vignette: Locator) {
  await vignette.locator('iframe').first().contentFrame().locator('#dismiss-button').click({ timeout: 10_000 });
}

/**
 * Registers handlers that Playwright runs only when one of these ads is visible
 * right before an action or a locator assertion; with no ad on screen, tests run
 * unchanged. Installed for every test by the `page` fixture.
 */
export async function installAdHandlers(page: Page) {
  await page.addLocatorHandler(page.locator(AD_VIGNETTE), closeVignette);
  await page.addLocatorHandler(page.locator(AD_ANCHOR), async (anchor) => {
    // The anchor has no close button, only a collapse handle. Collapsing works on
    // phones but not always on tablets; then remove just this ad element (no request
    // or script is blocked). Hiding it via style is not enough: the ad script
    // re-applies its own inline `display` style.
    await anchor.locator('.grippy-host').click({ timeout: 5_000 }).catch(() => {});
    const collapsed = await anchor.waitFor({ state: 'hidden', timeout: 2_000 }).then(() => true, () => false);
    if (!collapsed) await anchor.evaluate((ad) => ad.remove());
  });
}

/**
 * `page.waitForURL` that survives the vignette ad. Locator handlers do not run
 * during `waitForURL`, and the vignette holds the navigation until it is closed,
 * so close it here when it shows up instead of the target page.
 */
export async function waitForPage(page: Page, url: string | RegExp) {
  const vignette = page.locator(AD_VIGNETTE);
  await Promise.race([
    page.waitForURL(url, { waitUntil: 'domcontentloaded' }),
    vignette.waitFor({ state: 'visible' }),
  ]);
  if (await vignette.isVisible()) await closeVignette(vignette);
  await page.waitForURL(url, { waitUntil: 'domcontentloaded' });
}

/** Viewports for responsive tests (docs/test-cases/responsive.md): phone, tablet, desktop. */
export const RESPONSIVE_VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
] as const;

/** Asserts the page does not scroll horizontally (content no wider than the viewport). */
export async function expectNoHorizontalScroll(page: Page, { soft = false } = {}) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  const check = soft ? expect.soft : expect;
  check(overflow, `horizontal overflow in px on ${page.url()}`).toBeLessThanOrEqual(0);
}

/**
 * Asserts the element is usable on the current viewport: after scrolling to it,
 * it is fully inside the viewport and, for controls, a trial click proves nothing
 * covers it (a covering ad triggers the ad handlers). Plain text passes
 * `clickable: false` and is only checked for being fully in view.
 */
export async function expectWithinViewport(locator: Locator, { clickable = true } = {}) {
  // Centre it: `scrollIntoViewIfNeeded` leaves it flush with an edge, where sub-pixel
  // rounding can clip a fraction of a pixel and fail a full-visibility check. Scroll
  // again on every retry, because the page can scroll itself after we did.
  await expect(async () => {
    await locator.evaluate((element) => element.scrollIntoView({ block: 'center', inline: 'center' }));
    await expect(locator).toBeInViewport({ ratio: 1, timeout: 1_000 });
  }).toPass({ timeout: 10_000 });
  if (clickable) await locator.click({ trial: true });
}
