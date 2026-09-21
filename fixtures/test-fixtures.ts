import { test as base } from '@playwright/test';
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
 */

/** Extends the base test with ready-to-use Page Objects. */
export const test = base.extend<Pages>({
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

export { expect } from '@playwright/test';
