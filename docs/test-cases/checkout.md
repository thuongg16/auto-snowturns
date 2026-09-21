# Checkout Test Cases

These test cases implement the scenarios defined in `docs/test-scenarios/checkout.md`. Each case describes concrete tester actions and observable expected results, grounded in behavior verified directly on the live application (https://automationexercise.com/). All cases require a registered, authenticated account (see `docs/test-cases/auth.md` for registration/login test cases).

## 1. Happy Cases

### TC_CHECKOUT_001 — View checkout page with address and order details while authenticated

- Type: Happy
- Priority: High
- Scenario: CHECKOUT-S01
- Preconditions: Tester is logged in with a registered account and has at least one product in the cart.
- Test Data: One product added to the cart (e.g. "Blue Top").

#### Steps

1. While logged in, add a product to the cart and go to the Cart page.
2. Select "Proceed To Checkout".
3. Observe the resulting page.

#### Expected Result

1. The tester is taken to the checkout page (`/checkout`).
2. The page displays a "YOUR DELIVERY ADDRESS" and "YOUR BILLING ADDRESS" section populated with the account's registered name and address.
3. An order review table lists the cart item(s) with price, quantity, and line total, along with a "Total Amount".
4. A comment text field and a "Place Order" button are present.

---

### TC_CHECKOUT_002 — Complete checkout with valid payment details and place an order

- Type: Happy
- Priority: High
- Scenario: CHECKOUT-S02
- Preconditions: Tester is logged in, has at least one product in the cart, and has reached the checkout page.
- Test Data:
  - Name on Card: `QA Checkout`
  - Card Number: `4111111111111111` (a syntactically valid test card number; no real payment is processed)
  - CVC: `123`
  - Expiry Month: `12`, Expiry Year: `2030`

#### Steps

1. On the checkout page, optionally enter a comment, then select "Place Order".
2. On the payment page, enter the test card details above.
3. Select "Pay and Confirm Order".

#### Expected Result

1. After step 1, the tester is taken to the payment page (`/payment`).
2. After step 3, the tester is taken to an order confirmation page (URL includes `/payment_done/`) displaying "ORDER PLACED!" and a confirmation message.
3. "Download Invoice" and "Continue" options are shown on the confirmation page.

---

### TC_CHECKOUT_003 — Download invoice after placing an order

- Type: Happy
- Priority: Medium
- Scenario: CHECKOUT-S03
- Preconditions: An order has just been successfully placed (per TC_CHECKOUT_002) and the confirmation page is displayed.
- Test Data: None additional.

#### Steps

1. On the "ORDER PLACED!" confirmation page, select "Download Invoice".
2. Observe the browser's download behavior.

#### Expected Result

1. A file download is initiated (an invoice file corresponding to the placed order).
2. The tester remains on the order confirmation page after the download starts.

## 2. Negative Cases

### TC_CHECKOUT_N01 — Attempt to place an order with missing payment information

- Type: Negative
- Priority: Medium
- Scenario: CHECKOUT-S04
- Preconditions: Tester is logged in, has at least one product in the cart, and has reached the payment page.
- Test Data: All payment fields (Name on Card, Card Number, CVC, Expiry Month, Expiry Year) left empty.

#### Steps

1. On the payment page, leave all card fields empty.
2. Select "Pay and Confirm Order".
3. Observe the resulting page.

#### Expected Result

1. The form does not submit; the tester remains on the payment page (`/payment`).
2. The browser's native required-field validation flags the empty field(s).
3. No order confirmation ("ORDER PLACED!") page is reached.

## 3. Traceability Summary

| Scenario ID | Scenario | Test Case IDs |
|---|---|---|
| CHECKOUT-S01 | View checkout page with address and order details while authenticated | TC_CHECKOUT_001 |
| CHECKOUT-S02 | Complete checkout with valid payment details and place an order | TC_CHECKOUT_002 |
| CHECKOUT-S03 | Download invoice after placing an order | TC_CHECKOUT_003 |
| CHECKOUT-S04 | Attempt to place an order with missing payment information | TC_CHECKOUT_N01 |
