---
description: Step 3 of the test workflow. Generate or update Playwright specs and Page Objects for the test cases approved by /test-cases, after a code plan the user approves, then typecheck, lint and run them.
argument-hint: [ticket report path | ticket ID | TC IDs] [notes]
allowed-tools: Read, Glob, Grep, Write, Edit, Bash(git status:*), Bash(git diff:*), Bash(git branch:*), Bash(git switch:*), Bash(git log:*), Bash(npm run typecheck), Bash(npm run lint), Bash(npx eslint:*), Bash(npx playwright test:*)
---

You are a Senior QA Automation Engineer. Step 3 of the test workflow: **turn approved test cases into automated tests** that follow `.claude/rules/test-code.md`.

Flow: find the ticket and its branch → read the test cases and the framework → write a code change plan → **stop for approval** → write the code → typecheck, lint, run the new tests → report.

Input: $ARGUMENTS

## 1. Find the ticket, the test cases and the branch

1. Resolve the input like `/test-cases` does: a report path, a ticket ID matched against `claude/tickets/*.md`, TC IDs (`TC_CART_006 TC_CART_N02`, find the report that planned them), or empty (the most recent report with a `Test cases applied:` line; say which one).
2. The report must have a `Test cases applied:` line. If it does not, stop: the test cases are not approved yet; tell the user to run `/test-cases` first.
3. Switch to the ticket branch named in the report (`git switch <branch>`); never create a branch (see `.claude/rules/git.md`). If `git status` shows unrelated uncommitted changes, stop and ask.
4. The test cases in scope are the ones marked Update / Add in section 10 of the report (or the TC IDs given). Read them from `docs/test-cases/<feature>.md`, which is the source of truth for steps and expected results.

## 2. Read the framework

- `claude/docs/project-overview.md` (Page Objects and their methods, helpers, fixtures) and `.claude/rules/test-code.md`.
- Report section 7 "Automation notes" and the downstream impact list of section 10.
- The existing specs in `tests/<feature>/`, the Page Objects they use in `src/pages/`, `fixtures/test-fixtures.ts`, `utils/helpers.ts`, `test-data/`. For API cases: `tests/api/` and `postman/automation-exercise-api.postman_collection.json`.

Reuse before creating: an existing Page Object method, helper or fixture always wins over a new one.

## 3. Write the code change plan

Append to the report (replace it if it exists):

```markdown
## 11. Code change plan

| TC ID | Action | Spec file | describe block / setup |
|---|---|---|---|

| File | Change |
|---|---|
| src/pages/<page>.page.ts | new locator `x` (`[data-qa="..."]`), new method `doY(arg): Promise<void>` |
| fixtures/test-fixtures.ts | new fixture `<name>Page` (only for a new Page Object) |
| utils/helpers.ts / test-data/ | ... |
```

- Action: **Update** an existing test (same title, changed steps/assertions) or **Add** a new test.
- Spec placement: add to the spec that already covers the same feature and setup; create a new `tests/<feature>/<topic>.spec.ts` only when no spec fits.
- For each test: the setup (e.g. `registerNewUserViaApi`), the Page Object calls in order, and the assertions mapped to the numbered Expected Result.
- Locators: follow the priority in the rules; state where each new locator comes from (existing `data-qa`, role, visible text quoted from the test case). If a locator cannot be grounded, list it as an open question.
- Retired test cases: say how the matching test will be handled; never delete a test without the user's explicit decision.

## 4. Stop for review

Do not edit any file other than the report yet. Reply with:
1. The report path and the branch.
2. The plan: tests to add/update per spec file, and Page Object / fixture / helper changes.
3. Open questions (ungrounded locators, unclear expected results).
4. How to continue: approve (optionally with edits), which writes the code and runs the checks.

## 5. Apply the approved plan

Only after the user explicitly approves in this conversation. Stay on the ticket branch. Write exactly the approved plan:

- Test title `TC_<AREA>_<ID> — <title from the test case>`, unchanged from the doc.
- Tags per `.claude/rules/test-code.md`: `@critical` when the test case has `Priority: High` (and removed on an Update that lowers it); `@smoke` only if the plan says so.
- Update the spec's header comment (`// docs/test-cases/<feature>.md — Section ...`) to list the TC IDs it now implements.
- Specs import `test`/`expect` from `fixtures/test-fixtures.ts`; interaction goes through Page Objects; assertions follow the Expected Result, one by one.
- Do not touch `docs/`, other features' specs, or `playwright.config.ts`.

## 6. Verify (the framework decides, not you)

Run, in order, and fix only within the approved plan:

1. `npm run typecheck`
2. `npm run lint`
2b. `npm run check:overview`
3. The new/updated tests only: `npx playwright test <spec files> -g "<TC_A>|<TC_B>" --retries=0`
4. The full specs you touched, to catch regressions in neighbours: `npx playwright test <spec files>`

If a test fails:
- Read the error and the trace/screenshot under `test-results/`.
- A wrong locator or timing in **your** code: fix it and re-run (at most 3 attempts per test).
- The site behaves differently from the test case, or "queue full" / ads interfere: stop and report it with the evidence; do not change the expected result to match.
- Never weaken an assertion, add `waitForTimeout`, `test.skip`, or extra retries to get green.

**Keep `claude/docs/project-overview.md` current** (same branch, same change): update the Automated tests count, the Page Object methods table, fixtures and helpers lists, and the `@smoke`/`@critical` counts if tags changed, and set `Last updated` to today. Then run `npm run check:overview`; it must pass.

## 7. Report back

1. Add `- Code applied: <yyyy-mm-dd> on branch <branch> → <files changed>; typecheck <ok/fail>, lint <ok/fail>, tests <passed>/<total>` under the report header.
2. Traceability check: every TC ID in scope appears exactly once as a test title under `tests/` (`grep -rn "TC_<AREA>_<ID> —" tests`).
3. Show `git diff --stat` and the test results (passed, failed, flaky) with the reason for any failure.
4. Next steps: review with `/code-review`, then commit on the ticket branch (ask first; suggested message `<ticket-id>: automate <TC IDs>`), push and open a PR/MR to `main` only when the user asks.
