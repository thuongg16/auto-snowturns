# Test Plan

## 1. Document Information

| Field | Detail |
|---|---|
| Project name | Automation Exercise – QA Automation Portfolio |
| Application under test | [automationexercise.com](https://automationexercise.com/) |
| Test type | Functional, Regression, API (exploratory) |
| Testing approach | Manual test design followed by automated execution |
| Automation framework | Playwright (TypeScript) |
| Document purpose | Define the scope, strategy, and approach for testing the Automation Exercise application as part of a QA automation portfolio project |

This document describes an independent QA strategy built for the Automation Exercise demo application. It is intended to demonstrate professional test planning practices — scoping, risk analysis, and a practical automation approach — rather than to certify the production readiness of a third-party public site.

## 2. Application Overview

Automation Exercise is a publicly available demo e-commerce website built specifically for QA engineers to practice manual and automated testing. It simulates a real online store: visitors can browse products by category and brand, search for items, view product details, register/manage an account, add items to a cart, and complete a mock checkout. The site also exposes a small public REST API and publishes its own set of reference test cases, which makes it a suitable target for both UI and API test automation practice.

Main business/user functionality observed on the site:
- Product catalog browsing (categories: Women, Men, Kids; brand listings)
- Product search
- Product detail view, including customer reviews
- User registration, login, logout, and account management
- Shopping cart and checkout flow (address, payment details, order placement, invoice download)
- Newsletter email subscription (home page and cart page)
- Contact Us form
- A documented public REST API (`/api/...`) covering products, brands, search, login verification, and account CRUD operations

Main user flows relevant to testing:
1. New visitor registers an account and logs in
2. Returning user logs in, browses/searches products, and logs out
3. User adds one or more products to the cart and places an order
4. User subscribes to the newsletter or submits the Contact Us form
5. External client interacts with the public API directly (no UI)

## 3. Test Objectives

- Validate that core e-commerce user journeys (registration, login, browsing, cart, checkout) function correctly from an end-user perspective.
- Verify that key forms (registration, login, contact, subscription) handle both valid and invalid input appropriately.
- Confirm that product data displayed in the UI (listings, search results, details) is consistent and complete.
- Build a maintainable Playwright automation suite that can be run repeatedly to catch regressions.
- Exercise the site's public API to validate response codes, payloads, and basic contract behavior as a complement to UI testing.
- Produce portfolio-quality QA artifacts: test plan, test cases, manual execution evidence, bug reports (where defects are found), and automated tests with reports.

## 4. Test Scope

### 4.1 In Scope

- **User registration** — new account creation, required-field validation, duplicate-email handling
- **Login / logout** — valid credentials, invalid credentials, session termination
- **Account management** — viewing/updating account details, account deletion
- **Product browsing** — category navigation, brand navigation, product listing pages
- **Product search** — keyword search, no-results handling
- **Product details** — individual product page content (name, price, availability, category)
- **Product reviews** — submitting a review on a product detail page
- **Cart** — adding/removing products, updating quantities, cart persistence across navigation
- **Checkout / order placement** — address confirmation, order summary, payment form submission, order confirmation
- **Newsletter subscription** — subscribing via home page and cart page
- **Contact Us** — form submission with valid and invalid input
- **API testing** — the documented public endpoints under `/api/` (products, brands, search, login verification, account create/update/delete), covering both expected and error responses

### 4.2 Out of Scope

- **Wishlist** — not exposed as a distinct, documented feature on this application at the time of writing; excluded rather than assumed. If discovered during exploratory testing, it will be added to scope.
- **Real payment processing** — the checkout flow accepts payment details but does not process real transactions; testing will validate the form and order flow, not actual payment gateway integration.
- **Third-party integrations** (e.g., social login, external ad content) — not part of the core application logic being validated.
- **Performance, load, and security/penetration testing** — not performed as dedicated test types in this project. Limited exploratory checks (e.g., obvious input handling) may occur incidentally during functional testing but are not a defined activity (see Section 6).
- **Visual/pixel-level regression testing** — not part of this phase; noted as a future improvement (Section 17).
- **Legacy/deprecated browsers** — testing targets current evergreen browsers only (see Section 8).

## 5. Test Strategy

Testing combines manual test design with automated execution to balance thoroughness and maintainability:

- **Manual functional testing** is used first to explore each feature, confirm actual application behavior, and design test cases before automation.
- **Positive testing** validates that core flows work correctly with valid data (e.g., successful registration, successful checkout).
- **Negative testing** validates system behavior with invalid or missing data (e.g., wrong password, empty required fields, invalid email format).
- **Edge-case testing** covers boundary conditions where reasonably identifiable from the UI (e.g., empty cart checkout, searching with special characters, duplicate registration).
- **Regression testing** is achieved by re-running the automated Playwright suite after changes to the test codebase or when re-validating the application.
- **UI automation with Playwright** automates the highest-value, most stable user flows identified during manual testing.
- **API testing** validates the documented REST endpoints directly, independent of the UI, using Playwright's built-in API testing capabilities.
- **Cross-browser considerations** — automated tests are configured to run against Chromium, Firefox, and WebKit via Playwright's project configuration.
- **Basic validation of user flows and data** — assertions focus on observable, verifiable outcomes (visible messages, URL changes, element state) rather than internal implementation details.

**Manual vs. automated split:**
- Manual testing covers initial exploration, one-off/exploratory checks, and scenarios not worth automating (e.g., highly visual or rarely-changing content).
- Automation covers repeatable, high-value regression flows: registration, login/logout, search, cart operations, checkout, and API endpoint contracts.

## 6. Test Levels

- **UI / functional testing** — primary focus; validates user-facing behavior through the browser.
- **API testing** — validates the public REST endpoints as an independent layer, checking status codes and response payloads.
- **Integration-level considerations** — where UI actions depend on backend state (e.g., an item added via API appearing in the UI cart, if verifiable), basic consistency checks may be included, but this project does not perform dedicated backend/integration testing beyond what the public API exposes.
- **End-to-end testing** — key user journeys (e.g., register → login → add to cart → checkout → order confirmation) are tested end-to-end through the UI.

Performance, load, and security/penetration testing are explicitly not part of this test plan's scope, beyond incidental observations noted during functional testing.

## 7. Test Types

| Test Type | Purpose in this project |
|---|---|
| Functional testing | Confirm each feature (registration, cart, checkout, etc.) behaves as expected for valid input |
| Regression testing | Re-run the automated suite to catch breakages after changes |
| Smoke testing | Quick checks (e.g., home page loads, title is correct) to confirm the application is reachable before deeper testing |
| UI testing | Verify page elements, navigation, and forms render and behave correctly |
| API testing | Verify REST endpoint responses, status codes, and payload structure |
| Negative testing | Confirm proper handling of invalid credentials, missing fields, and malformed input |
| Edge-case testing | Confirm behavior at boundaries (empty cart, duplicate email, empty search) |
| Exploratory testing | Manual, unscripted investigation to discover behavior not covered by planned test cases, and to inform which flows are worth automating |

## 8. Test Environment

- **Application URL:** https://automationexercise.com/ (public demo environment; no staging/test instance is provided by the site owner)
- **Browsers:** Chromium, Firefox, WebKit — as configured in `playwright.config.ts` via Playwright's Desktop Chrome/Firefox/Safari device presets. Specific installed browser versions are managed by Playwright (`npx playwright install`) and are not pinned to fixed version numbers in this document.
- **Operating system:** Cross-platform via Playwright; test development and execution performed on macOS. CI execution (see `.github/workflows/playwright.yml`) runs on `ubuntu-latest`.
- **Automation stack:** Playwright Test (`@playwright/test`), TypeScript, Node.js (LTS, as configured in the CI workflow).
- **Test data:** A mix of dynamically generated data (e.g., unique emails per test run) and static reference data, managed as described in Section 9.
- **Environment configuration:** No environment-specific configuration (e.g., `.env` files, multiple base URLs) exists in the project at this time; the application under test is a single fixed public URL.

## 9. Test Data Strategy

- **Valid users:** Test accounts created programmatically during test setup (e.g., in a `beforeEach`/fixture step) using generated unique data, avoiding reliance on hardcoded, reusable accounts that could collide across test runs.
- **Invalid users:** Deliberately malformed or non-existent credentials (wrong password, unregistered email, invalid email format) defined directly in negative test cases.
- **Existing users:** Where a test requires an account to already exist (e.g., "register with existing email"), the account is created within the test itself rather than assumed to pre-exist, to keep tests independent and repeatable.
- **Product data:** Product names, categories, and prices are read from the live application rather than hardcoded where possible, to reduce maintenance if catalog content changes; where a fixed reference value is needed (e.g., a known category name), it is documented in the test case.
- **Registration data:** Generated per test run (e.g., timestamp- or random-suffix-based emails) to avoid "email already exists" collisions between runs.
- **Checkout data:** Placeholder address and payment form data, valid in format only — no real personal or payment information is used, consistent with this being a non-transactional demo checkout.
- **Reusable test data:** Test data will be maintained separately from test logic under `test-data/`, while reusable Playwright fixtures will be maintained under `fixtures/`.
Environment-specific configuration such as the application base URL, browser settings, and test timeouts will be managed through `playwright.config.ts` and environment variables where appropriate. as the automation suite grows, rather than duplicated across test files.
- **Sensitive/configurable values:** Any values that could be considered sensitive or environment-specific (e.g., if a `.env` file is introduced) will be read from environment variables and excluded from version control via `.gitignore`, never hardcoded into test files.

## 10. Entry Criteria

- The application under test (https://automationexercise.com/) is publicly accessible.
- The Playwright project is installed and configured (`npm install`, `npx playwright install`).
- Test cases have been documented (see `docs/test-cases/`) for the feature area being tested.
- Required test data strategy (Section 9) is defined for the feature area under test.

## 11. Exit Criteria

- All planned test cases for the in-scope functional areas (Section 4.1) have been executed at least once, manually or via automation.
- All identified defects have been logged with severity/priority and evidence, per Section 12.
- The automated Playwright suite runs successfully (or with documented, understood failures) across the configured browser projects.
- Test execution results, automation code, and reports are committed to the repository and reflected in project documentation (README, test reports).
- No outstanding critical/blocker defects remain unreported in the defect log.

## 12. Defect Management

- **Identification:** Defects are identified through manual exploratory testing and automated test failures, and are only logged once independently reproduced.
- **Severity:** Reflects functional impact (e.g., Critical — blocks a core flow such as checkout; Major — a feature works incorrectly but has a workaround; Minor — cosmetic or low-impact issue).
- **Priority:** Reflects urgency of fixing relative to other work, independent of severity (e.g., a minor issue on a core flow may still be high priority for this portfolio's demonstration purposes).
- **Reproduction steps:** Documented as a numbered, minimal sequence of actions needed to reproduce the issue.
- **Expected result:** What the application should do, based on observed/documented behavior or reasonable UX convention.
- **Actual result:** What the application actually does, described factually.
- **Evidence:** Screenshots, Playwright trace/video (where available via `trace: 'on-first-retry'` in `playwright.config.ts`), or console/network output supporting the report.
- **Bug report documentation:** Stored under a dedicated bug reports location within `docs/`, using a consistent template (ID, title, severity, priority, environment, steps, expected/actual result, evidence). Bug reports are created only for defects actually reproduced during this project's testing — not for assumed or theoretical issues.

## 13. Automation Strategy

- **Why Playwright:** Playwright provides reliable, fast, cross-browser automation with built-in auto-waiting, strong TypeScript support, and native API testing capabilities — allowing both UI and API tests to live in a single framework and codebase, which fits a portfolio project demonstrating modern automation practice.
- **What should be automated:** High-value, stable, repeatable flows — registration, login/logout, search, cart operations, checkout, and API endpoint contract checks — where the UI/API behavior is consistent enough to assert on reliably.
- **What should remain manual:** One-off exploratory checks, highly visual assessments, and any flow where the demo application's behavior is inconsistent or not clearly verifiable (e.g., content that changes independently of test actions).
- **Page Object Model (POM):** UI tests will be structured around page objects (under `src/pages/`) that encapsulate locators and actions for each page (e.g., Login page, Product listing page, Cart page), keeping test files focused on test logic rather than element details.
- **Fixtures:** Playwright fixtures (under `fixtures/`) will provide reusable setup such as an authenticated session or a pre-populated cart, reducing duplication across test files.
- **Test data separation:** Static and generated test data will live under `test-data/`, separate from test logic, so data changes don't require editing test files.
- **Reusable utilities:** Common helper functions (e.g., generating unique emails, formatting test data) live in `utils/` (see `utils/helpers.ts`) rather than being duplicated per test.
- **Test organization:** Spec files under `tests/` are grouped by feature area (e.g., `home.spec.ts`, with additional files planned per functional area such as registration, login, cart, checkout, and API tests) to keep the suite navigable as it grows.
- **Reporting:** Playwright's built-in HTML reporter (configured in `playwright.config.ts`) is used to generate readable test run reports, including traces on retry for failure diagnosis.
- **CI/CD considerations:** A GitHub Actions workflow (`.github/workflows/playwright.yml`) runs the suite on push/pull request to `main`/`master`, installs browsers, executes tests, and uploads the HTML report as a build artifact — providing continuous regression feedback without requiring local execution.

This architecture is intentionally kept practical: the project starts from a minimal scaffold (a single smoke test) and is expected to grow incrementally, adding page objects, fixtures, and test data as each functional area is automated, rather than over-building abstractions ahead of need.

## 14. Risks and Assumptions

**Risks:**
- The application is a **public demo environment** shared by many QA learners; concurrent use by other testers could cause unexpected data states or availability issues outside this project's control.
- **Test data persistence** is not guaranteed — accounts, cart contents, or reviews created during testing may not persist reliably or may be reset without notice, since this is a demo platform rather than a maintained production system.
- **Environment changes:** the application's UI, copy, or API contract could change over time without versioning or changelog, potentially breaking automated tests unrelated to any defect.
- **No real payment processing** exists behind the checkout flow, limiting how deeply order/payment validation can realistically be tested.
- **Dynamic content** (e.g., featured/recommended products, stock levels) may vary between test runs, requiring assertions to target stable elements rather than exact catalog contents.
- **Browser differences:** minor rendering or timing differences across Chromium, Firefox, and WebKit could cause inconsistent automation results that are environmental rather than functional defects.

**Assumptions:**
- *Assumption:* The site's publicly documented API endpoints (`/api/...`) remain available and behave consistently with their documented responses at the time of testing.
- *Assumption:* No authentication/API key is required to use the documented public API, based on the current API documentation page.
- *Assumption:* The application does not currently expose a distinct "Wishlist" feature; this is treated as out of scope (Section 4.2) unless discovered otherwise during testing.
- *Assumption:* Since this is a third-party public site, test execution avoids any activity that could be considered abusive (e.g., high-volume automated account creation) and is scoped to reasonable, portfolio-level test execution volume.

## 15. Deliverables

- Test plan (this document)
- Test scenarios (`docs/test-scenarios/`) and test cases (`docs/test-cases/`)
- Documented manual test flows (`docs/user-flows/`)
- Manual execution results/evidence
- Bug reports for reproduced defects
- Playwright automated test suite (`tests/`, `src/pages/`, `fixtures/`, `utils/`, `test-data/`)
- Automated test reports (Playwright HTML report, CI artifacts)
- Project README documenting setup, structure, and how to run the suite

## 16. Test Coverage Summary

| Functional Area | Manual Testing | UI Automation | API Testing |
|---|---|---|---|
| User registration | Yes | Yes | Yes (`createAccount`, `deleteAccount`) |
| Login / logout | Yes | Yes | Yes (`verifyLogin`) |
| Account management | Yes | Yes | Yes (`updateAccount`, `getUserDetailByEmail`) |
| Product browsing (category/brand) | Yes | Yes | Yes (`brandsList`, `productsList`) |
| Product search | Yes | Yes | Yes (`searchProduct`) |
| Product details | Yes | Yes | Partial (via `productsList` data) |
| Product reviews | Yes | Yes | Not exposed via documented API |
| Cart (add/remove/update) | Yes | Yes | Not exposed via documented API |
| Checkout / order placement | Yes | Yes | Not exposed via documented API |
| Newsletter subscription | Yes | Yes | Not exposed via documented API |
| Contact Us | Yes | Yes | Not exposed via documented API |

Exact test case counts are intentionally not defined here; they will be established during the dedicated test-case design phase (`docs/test-cases/`).

## 17. Future Improvements

- Expand CI/CD integration (e.g., scheduled nightly runs, parallel sharding, failure notifications).
- Broaden browser and device coverage (e.g., mobile emulation profiles already scaffolded but commented out in `playwright.config.ts`).
- Expand API automation to cover additional negative/edge scenarios beyond the current documented endpoint set.
- Improve test data management (e.g., centralized data factories, cleanup routines for created accounts).
- Introduce visual regression testing for key pages.
- Introduce basic accessibility testing (e.g., automated a11y checks on core pages).
- Introduce limited, clearly-scoped performance testing (e.g., page load timing) as an exploratory, non-load-testing activity.

These are proposed enhancements for future iterations of this portfolio project and are not currently implemented.
