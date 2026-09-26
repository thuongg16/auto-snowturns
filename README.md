# Automation Exercise — QA Automation Portfolio

End-to-end test automation project for [automationexercise.com](https://automationexercise.com/), built with Playwright and TypeScript as part of a QA Automation portfolio.

## Tech Stack

- [Playwright](https://playwright.dev/) (`@playwright/test`)
- TypeScript
- Page Object Model
- Playwright fixtures

## Project Structure

```
docs/                  Manual QA documentation (test plan, scenarios, cases, execution, user flows)
fixtures/               Playwright fixtures exposing Page Objects to tests
src/pages/              Page Object Model classes
test-data/               Static, non-sensitive test data (JSON)
tests/                   Playwright test specs
utils/                   Reusable test helpers (e.g. unique test data generation)
playwright.config.ts    Playwright configuration
eslint.config.mjs       Lint rules (machine-checked test standards)
CLAUDE.md               AI assistant entry point: source of truth, project map, standards
.claude/rules/          Test code and test documentation standards
```

See `docs/` for the full manual QA process: test plan, test scenarios, test cases, and manual execution records.

## Setup

```bash
npm install
npx playwright install
```

## Running Tests

```bash
npm test                 # run the full suite (api + chromium projects)
npm run test:headed      # run with browser UI visible
npm run test:smoke       # 8 fast main-flow tests (@smoke)
npm run test:critical    # tests whose test case is Priority High (@critical)
npm run report            # open the last HTML report
npm run typecheck         # type-check the project without emitting output
npm run lint              # lint (enforces the test standards in .claude/rules/test-code.md)
```

The base URL defaults to `https://automationexercise.com/` and can be overridden with an environment variable:

```bash
BASE_URL=https://automationexercise.com/ npx playwright test
```

## Reports

Playwright's HTML reporter runs by default; after a test run, open it with:

```bash
npx playwright show-report
```
