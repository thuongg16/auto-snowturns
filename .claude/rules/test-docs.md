# Test documentation standards

`docs/` is the requirement side of traceability. Edit it only when asked or when applying a plan the user approved (e.g. from `/ticket`); when you do, follow the existing files exactly.

## Chain and IDs

```
docs/test-plans/test-plan.md
  └─ docs/test-scenarios/<area>.md   <AREA>-S01, <AREA>-S02 ...   (what to test)
       └─ docs/test-cases/<area>.md  TC_<AREA>_001 ...             (how to test)
            └─ tests/<area>/*.spec.ts  test title starts with the TC ID
                 └─ docs/test-execution/<area>-execution.md        (results)
```

- File-to-area map (one file per feature; the same file name is used in `docs/test-scenarios/`, `docs/test-cases/` and `tests/<folder>/`):

  | File | Area code | Tests folder |
  |---|---|---|
  | `auth.md` | `AUTH` | `tests/auth/` |
  | `products.md` | `PROD` | `tests/products/` |
  | `cart.md` | `CART` | `tests/cart/` |
  | `checkout.md` | `CHECKOUT` | `tests/checkout/` |
  | `contact-us.md` | `CONTACT` | `tests/contact-us/` |
  | `newsletter.md` | `NEWS` | `tests/newsletter/` |
  | `api.md` | `API` | `tests/api/` |

  A new feature gets a new row: kebab-case file name, a new short uppercase area code.
- Case IDs: `TC_<AREA>_001` for happy, `TC_<AREA>_N01` for negative, `TC_<AREA>_E01` for edge. Never renumber an existing ID.
- Every test case names exactly one scenario (`Scenario: <AREA>-Sxx`).

## Scenario file format (`docs/test-scenarios/<file>.md`)

```markdown
# Cart Test Scenarios

These scenarios cover <feature> on Automation Exercise, based on direct verification of the live application (`/view_cart`, ...). They define **what** should be tested; step-by-step actions and expected results belong to the Test Case phase.

## 1. <Group>

### CART-S01 — View an empty cart
Verifies that <what, one or two sentences, no steps>.

## 2. <Group>
...

## 3. Scenario Coverage Summary

| ID | Area | Scenario | Priority |
|----|------|----------|----------|
| CART-S01 | <Group> | View an empty cart | Medium |
```

The coverage summary lists every scenario in ID order; keep it in sync with every change.

## Changing existing scenarios

- Behaviour changed: keep the ID, rewrite the title/description, and list the test cases and specs that reference it (they need updating next).
- New behaviour in an existing feature: add it to that feature's file with the next unused ID, under the matching group.
- Behaviour removed: never delete or reuse the ID; ask the user how to mark it.
- Never renumber existing IDs.

## Test case file format (`docs/test-cases/<file>.md`)

```markdown
# Cart Test Cases

These test cases implement the scenarios defined in `docs/test-scenarios/cart.md`. Each case describes concrete tester actions and observable expected results, grounded in behavior verified directly on the live application (https://automationexercise.com/).

## 1. Happy Cases

### TC_CART_001 — View an empty cart

- Type: Happy | Negative | Edge
- Priority: High | Medium | Low
- Scenario: CART-S01
- Preconditions: ...
- Test Data: ... (or "None required.")

#### Steps

1. ...

#### Expected Result

1. ...

---

## 2. Negative Cases
...

## 3. Edge Cases          (only when the file has edge cases)
...

## 4. Traceability Summary

| Scenario ID | Scenario | Test Case IDs |
|---|---|---|
| CART-S01 | View an empty cart | TC_CART_001 |
```

- Cases are separated by `---`; Expected Result is a numbered list.
- The traceability table lists every scenario of the feature in ID order with all its test case IDs; keep it in sync with every change.
- Changing cases follows the same rules as scenarios: keep IDs on update, next unused ID on add, never delete, reuse or renumber.

## Grounding

- Describe only behaviour verified on the live site: real page paths, real button labels, real messages.
- If behaviour is uncertain, write a note instead of guessing (see the password-confirmation note in `AUTH-S05`).
