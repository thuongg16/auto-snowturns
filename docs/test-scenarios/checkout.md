# Checkout Test Scenarios

These scenarios cover the checkout and order placement flow on Automation Exercise, based on direct verification of the live application (`/checkout`, `/payment`, `/payment_done/*`) with an authenticated account. They define **what** should be tested; step-by-step actions and expected results belong to the Test Case phase. Checkout requires an authenticated session — see `docs/test-scenarios/auth.md` and `docs/test-scenarios/cart.md` (CART-S05) for registration/login and the not-logged-in checkout gate.

## 1. Checkout Flow

### CHECKOUT-S01 — View checkout page with address and order details while authenticated
Verifies that an authenticated user with items in the cart can reach the checkout page and see their delivery/billing address (from account registration) and an accurate order review (items, quantities, prices, total).

### CHECKOUT-S02 — Complete checkout with valid payment details and place an order
Verifies that submitting valid (test) payment card details on the payment step results in an order confirmation.

### CHECKOUT-S03 — Download invoice after placing an order
Verifies that the order confirmation page offers an invoice download option after a successful order.

## 2. Checkout Validation

### CHECKOUT-S04 — Attempt to place an order with missing payment information
Verifies that the payment form does not accept submission when required card fields are left empty.

## 3. Scenario Coverage Summary

| ID | Area | Scenario | Priority |
|----|------|----------|----------|
| CHECKOUT-S01 | Checkout Flow | View checkout page with address and order details while authenticated | High |
| CHECKOUT-S02 | Checkout Flow | Complete checkout with valid payment details and place an order | High |
| CHECKOUT-S03 | Checkout Flow | Download invoice after placing an order | Medium |
| CHECKOUT-S04 | Checkout Validation | Attempt to place an order with missing payment information | Medium |
