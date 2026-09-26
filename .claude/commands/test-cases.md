---
description: Step 2 of the test workflow. Turn the scenarios approved by /ticket into test cases in docs/test-cases (update existing cases or add new ones), after a plan the user approves.
argument-hint: [ticket report path | ticket ID | scenario IDs] [notes]
allowed-tools: Read, Glob, Grep, Write, Edit, Bash(git status:*), Bash(git diff:*), Bash(git branch:*), Bash(git switch:*), Bash(git log:*)
---

You are a Senior QA Engineer. Step 2 of the test workflow: **write test cases** for scenarios that were already approved and applied by `/ticket`.

Flow: find the ticket and its branch → read the changed scenarios and the existing test cases → write a test case change plan → **stop for approval** → apply the plan to `docs/test-cases/`.

Input: $ARGUMENTS

## 1. Find the ticket, the scenarios and the branch

1. Resolve the input:
   - a report path (`claude/tickets/jira-SHOP-45.md`), or a ticket ID (`SHOP-45`, `123`) matched against `claude/tickets/*.md`;
   - scenario IDs (`CART-S06 CART-S02`): find the report that planned them;
   - empty: use the most recent report in `claude/tickets/` that has an `Applied:` line; say which one you picked.
   If nothing matches, stop and ask.
2. The report's `Applied:` line names the branch. Work on that branch:
   - already on it: continue;
   - it exists: `git switch <branch>`;
   - it does not exist, or the report has no `Applied:` line: stop. The scenarios have not been approved yet; tell the user to finish `/ticket` first. This command never creates a branch (see `.claude/rules/git.md`).
   - If `git status` shows uncommitted changes unrelated to this ticket, stop and ask.
3. The scenarios in scope are the ones the report marks Update / Add in its scenario change plan (or the IDs given in the input). Confirm them in the current `docs/test-scenarios/` files; `git diff main -- docs/test-scenarios` shows what the ticket changed.

## 2. Read context

- `claude/docs/project-overview.md` (which files and Page Objects exist) and `.claude/rules/test-docs.md` (formats and IDs).
- The report: requirements (R1...), section 6 "Test case outline", section 7 "Automation notes", open questions.
- For each affected feature: `docs/test-cases/<feature>.md` **in full** (existing IDs, sections, traceability table), and the scenarios in scope.
- For grounding steps and expected results: the related Page Objects in `src/pages/` (real labels, `data-qa` hooks, messages) and existing specs in `tests/<feature>/`. Do not invent UI text, messages or API fields; if a value is unknown, write it as an open question.

If the report still has blocking open questions for these scenarios, list them and ask before planning.

## 3. Write the test case change plan

Append a section to the report (replace it if it already exists):

```markdown
## 10. Test case change plan

### docs/test-cases/<feature>.md  (Existing file | New file)

| Action | TC ID | Type | Scenario | Priority | Before | After | Req | Reason |
|---|---|---|---|---|---|---|---|---|
```

Action is one of:
- **Update**: an existing case whose scenario changed; keep the ID; show what changes in preconditions, data, steps or expected result.
- **Add**: next unused ID for its type in that file: `TC_<AREA>_0xx` (Happy), `TC_<AREA>_Nxx` (Negative), `TC_<AREA>_Exx` (Edge).
- **Retire**: the scenario was retired; never delete or reuse the ID; ask how to mark it.

Rules for the cases:
- Every scenario in scope gets at least one case; cover the Happy path and the relevant Negative and Edge cases from the report outline.
- One case checks one behaviour. Steps are tester actions; Expected Result lists observable outcomes, numbered.
- Test data: reuse `test-data/` and describe generated data the way existing cases do (e.g. "a newly generated unique address").

Then give the full text of every Updated/Added case in the exact format of the file, and a **Downstream impact** list: specs to create or change (`tests/<feature>/...`, with the TC IDs), and Page Objects or helpers that will need new methods. This is the input for the code step.

## 4. Stop for review

Do not edit `docs/` or any file other than the report yet. Reply with:
1. The report path and the branch.
2. The plan table(s): Action, TC ID, type, scenario, title.
3. Open questions, and whether any block the plan.
4. How to continue: approve (optionally with edits, e.g. "drop TC_CART_E02", "priority High for N03"), which applies the plan on the branch.

## 5. Apply the approved plan

Only after the user explicitly approves in this conversation. Stay on the ticket branch. Apply exactly the approved plan and nothing else:

- **Existing file**, edit in place:
  - Update: keep the ID, rewrite the changed fields.
  - Add: put the case in its section (`## 1. Happy Cases`, `## 2. Negative Cases`, `## 3. Edge Cases`) after the last case of that section, ordered by ID; create the Edge section (before the traceability section, renumbering only section headings) if it does not exist.
  - Separate cases with `---` like the rest of the file.
  - Update the `Traceability Summary` table: one row per scenario in ID order, with every test case ID that implements it.
- **New file**: same structure as existing files: `# <Feature> Test Cases`, the intro sentence naming `docs/test-scenarios/<feature>.md`, the numbered sections, and a final `Traceability Summary` table.
- Do not touch `docs/test-scenarios/`, `docs/test-execution/`, `tests/` or `src/`.


**Keep `claude/docs/project-overview.md` current** (same branch, same change): update the Test cases count of each changed feature in the feature inventory, and set `Last updated` to today. Then run `npm run check:overview`; it must pass.

Afterwards:
1. Add `- Test cases applied: <yyyy-mm-dd> on branch <branch> → <files changed>` under the report header.
2. Run `git diff --stat -- docs/test-cases` and show the result.
3. Check traceability: every scenario in scope appears in the traceability table, and every new TC ID is unique in `docs/test-cases/`.
4. Show the downstream impact list as the input for the code step, and tell the user the next step is `/generate-tests <ticket-id>`.
5. Do not commit or push; ask the user (suggested message: `<ticket-id>: add test cases for <feature>`).
