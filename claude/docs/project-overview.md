# Project overview (AI context)

Read this first when planning. It summarizes what exists so you can open only the files a task needs.
Last updated: 2026-09-27. Updated by `/ticket`, `/test-cases` and `/generate-tests`, and by any other change to features, tests, Page Objects, tags, commands or CI. `npm run check:overview` (run in CI) verifies the counts, tags and Page Object list.

## 1. What this project is

- QA automation portfolio for https://automationexercise.com/, a public demo e-commerce site (not ours; ad-heavy; sometimes "queue full" under load).
- Stack: Playwright `^1.63` + TypeScript (strict), Page Object Model, Playwright fixtures, ESLint (`eslint-plugin-playwright`).
- Two test types: UI (project `chromium`) and API (project `api`, `tests/api/` only).

## 2. Feature inventory

One file name per feature across docs and tests (see `.claude/rules/test-docs.md`).

| Feature file | Area | Scenarios | Test cases | Automated tests | Page Objects used |
|---|---|---:|---:|---:|---|
| `auth.md` | AUTH | 14 | 16 | 16 | login, account, home |
| `products.md` | PROD | 10 | 10 | 10 | products, product-detail |
| `cart.md` | CART | 5 | 5 | 5 | products, cart, added-to-cart-modal |
| `checkout.md` | CHECKOUT | 4 | 4 | 4 | cart, checkout, payment, order-confirmation |
| `contact-us.md` | CONTACT | 3 | 3 | 3 | contact-us |
| `newsletter.md` | NEWS | 3 | 3 | 3 | subscription (component) |
| `api.md` | API | 15 | 16 | 16 | none (request API) |

Plus `tests/home.spec.ts` (1 smoke test, no TC ID). Every documented test case is automated. A scenario can have more than one case.

Gaps: `docs/test-execution/` has only `auth-execution.md` (all "Not Run"); `docs/user-flows/` is empty.

## 3. Code map

**Page Objects** (`src/pages/`, public methods):

| File | Methods |
|---|---|
| `home.page.ts` | goto, goToSignupLogin, goToProducts, goToCart, goToDeleteAccount, logout, expectLoggedInAs, expectLoggedOut |
| `login.page.ts` | goto, login, startSignup |
| `account.page.ts` | fillAccountDetails, createAccount, expectAccountCreated, expectAccountDeleted, continueToHome |
| `products.page.ts` | goto, search, openCategory, openBrand, viewProduct, addProductToCart |
| `product-detail.page.ts` | addToCart, submitReview |
| `cart.page.ts` | goto, rowForProduct, removeProduct, proceedToCheckout |
| `checkout.page.ts` | placeOrder |
| `payment.page.ts` | fillPaymentDetails, pay |
| `order-confirmation.page.ts` | expectOrderPlaced, downloadInvoice |
| `contact-us.page.ts` | goto, submit |
| `components/added-to-cart-modal.component.ts` | waitUntilVisible, goToCart, continueShopping |
| `components/subscription.component.ts` | subscribe |

**Fixtures**: `fixtures/test-fixtures.ts` exposes each page as a fixture (`homePage`, `loginPage`, `accountPage`, `productsPage`, `productDetailPage`, `cartPage`, `checkoutPage`, `paymentPage`, `orderConfirmationPage`, `contactUsPage`). Specs import `test`/`expect` from here. It also holds the note explaining why ad blocking was reverted.

**Helpers** (`utils/helpers.ts`): `generateUniqueEmail`, `getNewUserDetails`, `registerNewUser` (UI), `registerNewUserViaApi` (fast setup), `buildApiAccountPayload`, `addFirstProductToCartAndCheckout`.

**Tags**: `@smoke` (8 tests: home, TC_AUTH_002, TC_PROD_004, TC_CART_002, TC_CHECKOUT_002, TC_CONTACT_001, TC_NEWS_001, TC_API_001) and `@critical` (the 22 cases with `Priority: High`). Scripts: `npm run test:smoke`, `npm run test:critical`.

**Test data**: `test-data/users.json` (`newUser`). **API reference**: `postman/automation-exercise-api.postman_collection.json` + `postman/environments/`.

**Config** (`playwright.config.ts`): `BASE_URL` env (default the live site), `fullyParallel`, CI: `retries: 2`, `workers: 1`; timeouts 30s test / 5s expect; trace on first retry, screenshot and video on failure; reporters `html`, `list`, `json` → `results.json`, `junit` → `results.xml`.

## 4. Documentation chain

```
docs/test-plans/test-plan.md          scope, strategy, risks (one file)
  → docs/test-scenarios/<feature>.md  <AREA>-Sxx: what to test, + coverage summary table
    → docs/test-cases/<feature>.md    TC_<AREA>_001 / _N01 / _E01: steps + expected result
      → tests/<feature>/*.spec.ts     test title starts with the TC ID; header comment cites the doc section
        → docs/test-execution/<feature>-execution.md
```

Formats and ID rules: `.claude/rules/test-docs.md`. Code standards: `.claude/rules/test-code.md`.

## 5. AI workflow (current state)

| Step | Tool | Status |
|---|---|---|
| Test plan | `/plan-playwright <url>` | exists only in `~/.claude/commands/` (not in repo) |
| Requirement → scenarios | `/ticket <url or text>`: report + scenario change plan in `claude/tickets/`, then after approval creates branch `feature/<username>-<title>-<ticket-id>` and edits `docs/test-scenarios/` | done |
| Scenarios → test cases | `/test-cases [report \| ticket ID]`: on the ticket branch, test case change plan appended to the report, then after approval edits `docs/test-cases/` + traceability table | done |
| Test cases → code | `/generate-tests [report \| ticket ID \| TC IDs]`: on the ticket branch, code change plan appended to the report, then after approval writes specs/Page Objects and runs typecheck, lint and the new tests | done |
| Review | built-in `/code-review` + `.claude/rules/` | partial |
| Run tests | `npx playwright test`, CI | done |
| Failure analysis | none yet (planned `/analyze-failure`; inputs: `results.json`, Playwright report, `~/.test-history/history.db`) | todo |

Human approval gates: scenario plan, test cases, code review, commit/push. Git rules: `.claude/rules/git.md`.

## 6. Quality gates (source of truth)

| Check | Local | GitHub Actions (push/PR to main) | Jenkins (daily ~08:xx + manual) |
|---|---|---|---|
| Type check | `npm run typecheck` | yes | yes |
| Lint | `npm run lint` | yes | yes |
| Overview up to date | `npm run check:overview` | yes | yes |
| Tests | `npm test` | yes | yes |

## 7. CI and reporting (Jenkins, local machine)

- `Jenkinsfile`: `npm ci` → type check → lint + overview check → install browsers → `npx playwright test` → post: archive report, `publishHTML` (tab `PlaywrightReport`), `junit`, `node utils/report.js`, `slackSend`.
- `utils/report.js`: reads `results.json`; (1) appends the run to SQLite `~/.test-history/history.db` (tables `runs`, `tests`); (2) writes `slack-attachments.json` (per-test cells with a deep link `PlaywrightReport/index.html#?testId=<id>`).
- Slack channel `#qa-results`. Grafana `http://localhost:3000`, dashboard "Playwright test history" (`grafana/dashboard.json`), data source SQLite. Details: `claude/docs/grafana.md`.
- Jenkins runs at `localhost:9090` with CSP relaxed by `~/.jenkins/init.groovy.d/relax-csp.groovy`; links work only on this machine.

## 8. Folder guide

| Path | Contents | Edit? |
|---|---|---|
| `docs/` | Manual QA docs (above) | only when asked or via an approved plan |
| `tests/`, `src/pages/`, `fixtures/`, `utils/`, `test-data/` | Test framework | yes, following the rules |
| `claude/docs/` | Docs for/by Claude (this file, `grafana.md`) | yes |
| `claude/tickets/` | `/ticket` reports | written by `/ticket` |
| `.claude/rules/`, `.claude/commands/` | Rules and commands | yes |
| `grafana/` | Dashboard JSON | yes |
| `playwright-report/`, `test-results/`, `results.*`, `slack-attachments.json` | Generated, git-ignored | no |
