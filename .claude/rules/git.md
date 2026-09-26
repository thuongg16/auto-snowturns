# Git workflow

## Branches are created only by an approved `/ticket` plan

A branch is created in exactly one situation: the user runs `/ticket <url>`, reviews the scenario change plan, and approves it. The branch is created at that moment, before the plan is applied.

- Running `/ticket` (analysis and planning) never creates a branch. If the plan is not approved, no branch is created.
- Later steps for the same ticket (`/test-cases`, `/generate-tests`) reuse that branch: switch to it, never create a new one.
- Any other work (setup, rules, config, fixes the user asks for directly) stays on the current branch, including `main`. Do not create a branch unless the user asks for one.

Branch name:

```
feature/<username>-<title-of-ticket>-<ticket-id>
```

| Part | Source | Rules |
|---|---|---|
| `username` | the author: `git config user.name` | slugified |
| `title-of-ticket` | the ticket title from the `/ticket` report | slugified, at most 50 characters, cut at a word boundary |
| `ticket-id` | the task ID in the tracker: Jira key (`SHOP-45`), Redmine or GitHub/GitLab issue number (`123`) | kept as written in the tracker |

Slugify = lowercase, remove accents and map `đ` → `d` (Vietnamese included: `giỏ hàng` → `gio-hang`, `đơn hàng` → `don-hang`), replace anything that is not `a-z0-9` with `-`, collapse repeated `-`, trim `-` at both ends.

Examples:
- Jira `SHOP-45` "Apply discount code at checkout" → `feature/thuong-apply-discount-code-at-checkout-SHOP-45`
- Redmine `#1287` "Giỏ hàng hiển thị sai tổng tiền" → `feature/thuong-gio-hang-hien-thi-sai-tong-tien-1287`

If the ticket title or ID is unknown (e.g. `/ticket` was given pasted text), ask the user for them before creating the branch; do not invent an ID.

## Creating the branch

1. `git status --porcelain`: the report of the ticket being approved (`claude/tickets/<source>-<id>.md`) is expected and is carried onto the new branch. Any other uncommitted change is not part of this approval: stop and ask the user what to do with it (commit, stash, or bring it along).
2. `git fetch origin main`, then `git switch -c <branch> origin/main`. The branch always starts from the latest `main`. If there is no remote, use the local `main`.
3. If the branch already exists (the same ticket is being revisited), `git switch <branch>` instead of creating it.
4. Tell the user the branch name before making the edits.

## Commit and push

- Never `git commit` or `git push` without the user's explicit yes, every time.
- Commit messages reference the ticket ID, e.g. `SHOP-45: add discount code scenarios`.
- Push with `git push -u origin <branch>` and open the PR/MR against `main` only when the user asks.
