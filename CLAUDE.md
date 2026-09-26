# automation-exercise

Playwright + TypeScript end-to-end and API test suite for https://automationexercise.com/ (a shared public demo site we do not control).

Before planning or exploring, read `claude/docs/project-overview.md`: a compact map of features, coverage counts, Page Objects, helpers, workflow and CI. Open other files only as the task needs them. `/ticket`, `/test-cases` and `/generate-tests` update it; any other change to features, tests, Page Objects, tags, commands or CI must update it too, and CI (`npm run check:overview`) fails if its counts drift.

## Source of truth

AI assists; the framework and CI decide. A change is done only when all of these pass:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint: enforces the hard rules in .claude/rules/test-code.md
npm run check:overview # claude/docs/project-overview.md still matches the repo
npx playwright test # or a focused subset: npx playwright test tests/cart -g "TC_CART_002"
```

CI runs the same checks: `.github/workflows/playwright.yml` (push/PR) and `Jenkinsfile` (daily, reports to Slack and Grafana).
Never claim a test passes without running it. Never weaken an assertion, add a retry, or skip a test just to make CI green; explain the failure instead.

## Project map

| Path | Purpose |
|---|---|
| `docs/` | Manual QA docs, the requirement side of traceability: `test-plans/` → `test-scenarios/` → `test-cases/` → `test-execution/`, plus `user-flows/`. Edit only when asked or when applying a user-approved plan (e.g. `/ticket`). |
| `tests/<area>/*.spec.ts` | Specs. `tests/api/` runs in the `api` project; everything else in `chromium`. |
| `src/pages/` | Page Objects; shared widgets in `src/pages/components/`. |
| `fixtures/test-fixtures.ts` | Exposes every Page Object as a fixture. Specs import `test`/`expect` from here. |
| `utils/helpers.ts` | Reusable test setup (unique emails, API registration, checkout setup). |
| `test-data/` | Static, non-sensitive test data (JSON). |
| `postman/` | API collection and environment. |
| `utils/report.js` | CI-only: writes run history (SQLite, for Grafana) and the Slack message. |
| `claude/docs/` | Docs written by/for Claude (e.g. `grafana.md`). |
| `claude/tickets/` | Requirement analyses from `/ticket` (one report per ticket). |

## Standards

@.claude/rules/test-code.md
@.claude/rules/test-docs.md
@.claude/rules/git.md

## Workflow commands

- `/ticket <url | text> [notes]`: analyze a requirement ticket (GitHub, GitLab, Jira, Redmine, a web page, or pasted text), map it to existing coverage, and write a report with a scenario change plan to `claude/tickets/`. After approval it updates the matching `docs/test-scenarios/<feature>.md` (edit existing scenarios, add new ones) or creates a new file for a new feature. Private sources need `GITHUB_TOKEN`, `GITLAB_TOKEN`, `JIRA_EMAIL`+`JIRA_TOKEN` or `REDMINE_API_KEY` in the environment.
- `/test-cases [report | ticket ID | scenario IDs]`: step 2. On the ticket's branch, plan test cases for the approved scenarios (update / add in `docs/test-cases/<feature>.md`, traceability table included), stop for approval, then apply.
- `/generate-tests [report | ticket ID | TC IDs]`: step 3. On the ticket's branch, plan specs and Page Object changes for the approved test cases, stop for approval, then write the code and run typecheck, lint and the new tests.

## Working agreements

- Branches are created only when the user approves a `/ticket` plan: `feature/<username>-<title-of-ticket>-<ticket-id>` from `main` (see `.claude/rules/git.md`). Other work stays on the current branch.
- Ask before `git commit` or `git push`, every time.
- Ground UI behaviour, messages and API responses in the live site or existing Page Objects; do not invent them.
- Reuse existing Page Objects, fixtures and helpers before creating new ones.
- The site is flaky under load ("queue full") and ad-heavy; `retries` in `playwright.config.ts` absorbs that. Read the note in `fixtures/test-fixtures.ts` before touching ad or network handling.
