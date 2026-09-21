# Newsletter Test Cases

These test cases implement the scenarios defined in `docs/test-scenarios/newsletter.md`. Each case describes concrete tester actions and observable expected results, grounded in behavior verified directly on the live application (https://automationexercise.com/).

## 1. Happy Cases

### TC_NEWS_001 — Subscribe to the newsletter with a valid email on the home page

- Type: Happy
- Priority: Medium
- Scenario: NEWS-S01
- Preconditions: Tester is on the home page.
- Test Data: Email: a valid, newly generated address, e.g. `auth_news_<timestamp>@example.com`

#### Steps

1. Scroll to the "SUBSCRIPTION" section at the bottom of the home page.
2. Enter the test email address into the subscription field.
3. Select the subscribe (arrow) button.

#### Expected Result

1. The message "You have been successfully subscribed!" is displayed.
2. No page navigation or error occurs.

---

### TC_NEWS_002 — Subscribe to the newsletter with a valid email on the cart page

- Type: Happy
- Priority: Low
- Scenario: NEWS-S02
- Preconditions: Tester is on the cart page.
- Test Data: Email: a valid, newly generated address, e.g. `auth_news_cart_<timestamp>@example.com`

#### Steps

1. Navigate to the Cart page.
2. Scroll to the "SUBSCRIPTION" section.
3. Enter the test email address and select the subscribe button.

#### Expected Result

1. The message "You have been successfully subscribed!" is displayed, consistent with the home page behavior.

## 2. Negative Cases

### TC_NEWS_N01 — Attempt to subscribe with an invalid email format

- Type: Negative
- Priority: Low
- Scenario: NEWS-S03
- Preconditions: Tester is on the home page.
- Test Data: Email: `not-an-email` (no `@` symbol)

#### Steps

1. Enter the malformed email value into the subscription field.
2. Select the subscribe button.

#### Expected Result

1. The form is not submitted; the browser's native email-format validation flags the field as invalid.
2. The "You have been successfully subscribed!" message does not appear.

## 3. Traceability Summary

| Scenario ID | Scenario | Test Case IDs |
|---|---|---|
| NEWS-S01 | Subscribe to the newsletter with a valid email on the home page | TC_NEWS_001 |
| NEWS-S02 | Subscribe to the newsletter with a valid email on the cart page | TC_NEWS_002 |
| NEWS-S03 | Attempt to subscribe with an invalid email format | TC_NEWS_N01 |
