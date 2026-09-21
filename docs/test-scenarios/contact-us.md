# Contact Us Test Scenarios

These scenarios cover the Contact Us form on Automation Exercise, based on direct verification of the live application (`/contact_us`). They define **what** should be tested; step-by-step actions and expected results belong to the Test Case phase.

## 1. Form Submission

### CONTACT-S01 — Submit the Contact Us form with all fields completed
Verifies that submitting the form with Name, Email, Subject, and Message filled in results in a success confirmation.

### CONTACT-S02 — Submit the Contact Us form with only the required field completed
Verifies the form's actual required-field behavior by submitting with only the Email field filled in, to confirm which fields the application truly enforces as mandatory.

### CONTACT-S03 — Attempt to submit the Contact Us form without a required email address
Verifies that the form does not accept submission when the Email field (the field observed to be required) is left empty.

## 2. Scenario Coverage Summary

| ID | Area | Scenario | Priority |
|----|------|----------|----------|
| CONTACT-S01 | Form Submission | Submit the Contact Us form with all fields completed | High |
| CONTACT-S02 | Form Submission | Submit the Contact Us form with only the required field completed | Low |
| CONTACT-S03 | Form Submission | Attempt to submit the Contact Us form without a required email address | Medium |
