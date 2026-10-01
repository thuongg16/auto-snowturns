import { test as base, BrowserContext } from '@playwright/test';
import { HomePage } from '../src/pages/home.page';
import { LoginPage } from '../src/pages/login.page';
import { AccountPage } from '../src/pages/account.page';
import { ProductsPage } from '../src/pages/products.page';
import { ProductDetailPage } from '../src/pages/product-detail.page';
import { CartPage } from '../src/pages/cart.page';
import { CheckoutPage } from '../src/pages/checkout.page';
import { PaymentPage } from '../src/pages/payment.page';
import { OrderConfirmationPage } from '../src/pages/order-confirmation.page';
import { ContactUsPage } from '../src/pages/contact-us.page';
import { generateUniqueEmail, installAdHandlers, registerNewUserViaApi } from '../utils/helpers';

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  accountPage: AccountPage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  orderConfirmationPage: OrderConfirmationPage;
  contactUsPage: ContactUsPage;
};

/**
 * NOTE — network-level ad blocking was tried here (aborting requests to
 * doubleclick.net, googlesyndication.com, etc. via `page.route()`) to
 * address ad-related flakiness (hung navigations, intercepted clicks,
 * layout-shift misses). It was reverted: across repeated full-suite runs
 * it did not reliably reduce failures — one run improved, two others got
 * *worse* (checkout and cart tests failing that passed before), and a
 * targeted single-run diagnostic with the same blocklist showed the
 * "Added to cart" modal working fine, so the extra failures weren't even
 * consistently reproducible as caused by the blocking itself. Given a live
 * third-party site we don't control, blocking its network requests trades
 * a well-understood risk (occasional flaky waits, mitigated by `retries`
 * in playwright.config.ts) for a poorly-understood one (breaking some
 * behavior the app's own JS depends on). Do not re-add this without solid
 * evidence it helps across multiple runs, not just one.
 *
 * Instead, the two ads that cover the page (the full-screen vignette and the
 * mobile top anchor) are closed only when they are on screen: see
 * `installAdHandlers` and `waitForPage` in utils/helpers.ts.
 */

/** Extends the base test with ready-to-use Page Objects. */
export const test = base.extend<Pages>({
  page: async ({ page }, use) => {
    await installAdHandlers(page);
    await use(page);
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
  orderConfirmationPage: async ({ page }, use) => {
    await use(new OrderConfirmationPage(page));
  },
  contactUsPage: async ({ page }, use) => {
    await use(new ContactUsPage(page));
  },
});

type Account = { name: string; email: string; password: string };
type AuthSession = { account: Account; storageState: Awaited<ReturnType<BrowserContext['storageState']>> };

/**
 * `test` with a logged-in account: each worker registers one account (API),
 * logs in once, and every test in that worker starts from the saved session
 * instead of logging in again.
 *
 * Use it only when login is setup, not the behaviour under test. Do not use it
 * for tests that log out, delete the account, or change its details: the
 * session and account are shared by all tests in the worker. The cart is kept
 * in the session too, so start with `cartPage.clear()` when the cart matters.
 */
export const authTest = test.extend<{ account: Account }, { authSession: AuthSession }>({
  authSession: [
    async ({ browser }, use, workerInfo) => {
      const context = await browser.newContext({ baseURL: workerInfo.project.use.baseURL });
      const page = await context.newPage();
      const name = 'QA Auth Worker';
      const email = generateUniqueEmail(`auth_worker${workerInfo.parallelIndex}`);
      const { password } = await registerNewUserViaApi(page, new LoginPage(page), name, email);
      const storageState = await context.storageState();
      await context.close();
      await use({ account: { name, email, password }, storageState });
    },
    { scope: 'worker' },
  ],
  storageState: async ({ authSession }, use) => {
    await use(authSession.storageState);
  },
  account: async ({ authSession }, use) => {
    await use(authSession.account);
  },
});

export { expect } from '@playwright/test';
