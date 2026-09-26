# Test code standards

Rules marked **[lint]** are enforced by `npm run lint` (`eslint.config.mjs`); the rest are checked in review.

## Structure

- Specs import `test` and `expect` from `fixtures/test-fixtures.ts`, not from `@playwright/test`, and receive Page Objects as fixtures (`async ({ page, loginPage, homePage }) => ...`).
- Page interaction and locators live in Page Objects (`src/pages/*.page.ts`); specs describe behaviour. A new page gets a new class plus a fixture entry in `fixtures/test-fixtures.ts`.
- Page Object pattern (see `src/pages/login.page.ts`): `readonly page`, `readonly` Locator fields assigned in the constructor, action methods (`goto()`, `login()`), and `expect…()` methods for reusable assertions.
- Shared setup goes in `utils/helpers.ts`. Prefer API setup (`registerNewUserViaApi`) when the setup itself is not under test.

## Naming and traceability

- Test title: `TC_<AREA>_<ID> — <title from docs/test-cases>`, e.g. `TC_AUTH_002 — Login with valid credentials`. The ID must exist in `docs/test-cases/<area>.md`.
- Each spec starts with a comment naming the doc and sections it implements, e.g. `// docs/test-cases/auth.md — Section 1 (Happy: TC_AUTH_002), Section 2 (Negative: N05-N08)`.
- Files: `tests/<area>/<feature>.spec.ts`, kebab-case.

## Tags

Tags select groups of tests (`npx playwright test --grep @smoke`). Only these tags exist:

| Tag | Meaning | Rule |
|---|---|---|
| `@critical` | the test case has `Priority: High` in `docs/test-cases/` | add or remove it whenever the doc's priority changes |
| `@smoke` | one fast main flow per feature, to check the site is up | curated list; add only when a new feature has no smoke test |

Syntax: `test('TC_AUTH_002 — Login with valid credentials', { tag: ['@smoke', '@critical'] }, async ({ ... }) => { ... })`.
Do not invent new tags without the user's agreement; filter by TC ID (`-g "TC_CART_"`) or folder instead.

## Locators

Priority order:
1. `data-qa` attributes: `page.locator('[data-qa="login-email"]')`.
2. Role: `page.getByRole('link', { name: 'Logout' })`.
3. Visible text: `page.getByText('Your email or password is incorrect!')`.
4. CSS only when none of the above exist; scope it tightly and comment why.

Never use XPath, generated class names, or index-based selectors when a stable option exists.

## Waiting and assertions

- **[lint]** No `page.waitForTimeout()`, no `networkidle`, no `page.pause()`.
- Use web-first assertions (`await expect(locator).toBeVisible()`, `toHaveURL`, `toHaveText`) and `waitForURL`; they auto-wait.
- Every test asserts observable outcomes, not just that actions ran. **[lint, warning]** `expect-expect`.
- Assert what the test case's Expected Result says, no more and no less.

## Test data and isolation

- Each test is independent and can run alone or in parallel (`fullyParallel: true`).
- Unique data via `generateUniqueEmail('<area>_<purpose>')`; static data from `test-data/`.
- No secrets or real personal data in code or `test-data/`.

## Focus and skipping

- **[lint]** No `test.only` / `describe.only`.
- **[lint]** No `test.skip` / `test.fixme` without an explicit, reviewed reason; prefer fixing or raising the failure.

## API tests

- Live in `tests/api/`, use `request` / `page.request`, and assert both the HTTP status and the `responseCode` in the JSON body (the API returns HTTP 200 with a logical code; see `TC_API_E01`).
- Endpoints and payloads match `postman/automation-exercise-api.postman_collection.json`.
