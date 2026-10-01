import { test, expect } from '../../fixtures/test-fixtures';
import { HomePage } from '../../src/pages/home.page';
import {
  RESPONSIVE_VIEWPORTS,
  expectNoHorizontalScroll,
  expectWithinViewport,
  waitForPage,
} from '../../utils/helpers';

// docs/test-cases/responsive.md — Section 1 (Happy: TC_RESP_001-004), Section 3 (Edge: E01)
// Each case runs once per supported viewport; E01 runs at 375px only.

const PUBLIC_PAGES = [
  '/',
  '/products',
  '/product_details/1',
  '/category_products/1',
  '/brand_products/Polo',
  '/view_cart',
  '/login',
  '/contact_us',
  '/test_cases',
  '/api_list',
];

/** Main menu links under test and the page each one opens (Video Tutorials is external). */
const menuLinks = (home: HomePage) =>
  [
    [home.homeLink, /automationexercise\.com\/?$/],
    [home.productsLink, /\/products$/],
    [home.cartLink, /\/view_cart$/],
    [home.signupLoginLink, /\/login$/],
    [home.testCasesLink, /\/test_cases$/],
    [home.apiTestingLink, /\/api_list$/],
    [home.contactUsLink, /\/contact_us$/],
  ] as const;

for (const viewport of RESPONSIVE_VIEWPORTS) {
  test.describe(`${viewport.width}px`, () => {
    test.use({ viewport });

    test('TC_RESP_001 — Main public pages have no horizontal scroll', { tag: ['@critical'] }, async ({ page }) => {
      // Known site defect (SCRUM-2; claude/tickets/pasted-2026-09-28.md §12): at 768px the
      // `feedback@automationexercise.com` link on /contact_us cannot wrap and ends at x≈802,
      // so the page scrolls ~38px sideways (ads excluded). Expected to fail until the site
      // fixes it; an unexpected pass means it was fixed and this line must be removed.
      test.fail(viewport.width === 768, 'Site defect: /contact_us e-mail link overflows at 768px');
      for (const path of PUBLIC_PAGES) {
        await page.goto(path, { waitUntil: 'domcontentloaded' });
        // Soft: report every page that overflows, not only the first.
        await expectNoHorizontalScroll(page, { soft: true });
      }
    });

    test('TC_RESP_002 — Main menu links are visible, uncovered and open their pages', { tag: ['@critical'] }, async ({
      page,
      homePage,
    }) => {
      for (const [link, url] of menuLinks(homePage)) {
        await homePage.goto();
        await expectWithinViewport(link);
        await link.click();
        await waitForPage(page, url);
      }
    });

    test('TC_RESP_003 — Product cards show name, price and actions within the viewport', { tag: ['@critical'] }, async ({
      productsPage,
    }) => {
      await productsPage.goto();

      for (const index of [0, 1, 2]) {
        await expect(productsPage.cardName(index)).toHaveText(/\S/);
        await expect(productsPage.cardPrice(index)).toHaveText(/Rs\. \d+/);
        await expectWithinViewport(productsPage.cardAddToCart(index));
        await expectWithinViewport(productsPage.cardViewProduct(index));
      }
    });

    test('TC_RESP_004 — Product grid fits the viewport width', async ({ page, productsPage }) => {
      await productsPage.goto();
      await expect(productsPage.productCards.first()).toBeVisible();

      const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
      const cards = await productsPage.productCards.evaluateAll((elements) =>
        elements.map((element) => {
          const box = element.getBoundingClientRect();
          return { left: box.left, right: box.right, top: box.top };
        }),
      );

      for (const [index, card] of cards.entries()) {
        expect.soft(card.left, `card ${index} left edge`).toBeGreaterThanOrEqual(0);
        expect.soft(card.right, `card ${index} right edge`).toBeLessThanOrEqual(viewportWidth);
      }

      // Recorded, not asserted: there is no design reference for the column count.
      const perRow = cards.filter((card) => Math.abs(card.top - cards[0].top) < 1).length;
      test.info().annotations.push({ type: 'cards-per-row', description: `${perRow} at ${viewport.width}px` });
    });

    if (viewport.width === 375) {
      test('TC_RESP_E01 — At 375px the wrapped menu does not cover page content', async ({
        page,
        homePage,
        productsPage,
      }) => {
        for (const open of [() => homePage.goto(), () => productsPage.goto()]) {
          await open();

          // Gap between the header's bottom edge and the first visible block after it.
          const gap = await page.locator('#header').evaluate((header) => {
            let next = header.nextElementSibling;
            while (next && (next as HTMLElement).offsetHeight === 0) next = next.nextElementSibling;
            return next ? next.getBoundingClientRect().top - header.getBoundingClientRect().bottom : 0;
          });
          expect(gap, `header overlaps the content on ${page.url()}`).toBeGreaterThanOrEqual(0);

          for (const [link] of menuLinks(homePage)) {
            await expectWithinViewport(link);
          }
        }
      });
    }
  });
}
