# Contact Us Test Cases

These test cases implement the scenarios defined in `docs/test-scenarios/contact-us.md`. Each case describes concrete tester actions and observable expected results, grounded in behavior verified directly on the live application (https://automationexercise.com/).

## 1. Happy Cases

### TC_CONTACT_001 — Submit the Contact Us form with all fields completed

- Type: Happy
- Priority: High
- Scenario: CONTACT-S01
- Preconditions: Tester is on the Contact Us page.
- Test Data:
  - Name: `QA Contact`
  - Email: a valid, newly generated address, e.g. `auth_contact_<timestamp>@example.com`
  - Subject: `Test Inquiry`
  - Message: `This is a test message for the Contact Us form.`

#### Steps

1. Navigate to the "Contact us" page.
2. Enter the Name, Email, Subject, and Message.
3. Select the "Submit" button.
4. Accept the browser confirmation dialog that appears ("Press OK to proceed!").

#### Expected Result

1. After step 4, the tester remains on the Contact Us page.
2. The message "Success! Your details have been submitted successfully." is displayed.

## 2. Negative Cases

### TC_CONTACT_N01 — Attempt to submit the Contact Us form without a required email address

- Type: Negative
- Priority: Medium
- Scenario: CONTACT-S03
- Preconditions: Tester is on the Contact Us page.
- Test Data: Name: `QA No Email`; Email left empty; Subject and Message left empty.

#### Steps

1. Navigate to the "Contact us" page.
2. Enter a value in the Name field only, leaving Email, Subject, and Message empty.
3. Select the "Submit" button.

#### Expected Result

1. The form does not submit; the browser's native required-field validation flags the empty Email field.
2. No confirmation dialog appears, and the "Success!" message is not displayed.

## 3. Edge Cases

### TC_CONTACT_E01 — Submit the Contact Us form with only the required Email field completed

- Type: Edge
- Priority: Low
- Scenario: CONTACT-S02
- Preconditions: Tester is on the Contact Us page.
- Test Data: Email: a valid, newly generated address; Name, Subject, and Message left empty.

#### Steps

1. Navigate to the "Contact us" page.
2. Enter only a valid Email address, leaving Name, Subject, and Message empty.
3. Select the "Submit" button.
4. Accept the browser confirmation dialog that appears.

#### Expected Result

1. The form submits successfully despite Name, Subject, and Message being empty.
2. The message "Success! Your details have been submitted successfully." is displayed, confirming that only Email is enforced as a required field by the application.

## 4. Traceability Summary

| Scenario ID | Scenario | Test Case IDs |
|---|---|---|
| CONTACT-S01 | Submit the Contact Us form with all fields completed | TC_CONTACT_001 |
| CONTACT-S02 | Submit the Contact Us form with only the required field completed | TC_CONTACT_E01 |
| CONTACT-S03 | Attempt to submit the Contact Us form without a required email address | TC_CONTACT_N01 |
