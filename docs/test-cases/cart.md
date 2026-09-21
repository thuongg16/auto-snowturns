# Cart Test Cases

These test cases implement the scenarios defined in `docs/test-scenarios/cart.md`. Each case describes concrete tester actions and observable expected results, grounded in behavior verified directly on the live application (https://automationexercise.com/).

## 1. Happy Cases

### TC_CART_001 — View an empty cart

- Type: Happy
- Priority: Medium
- Scenario: CART-S01
- Preconditions: No products have been added to the cart in the current session.
- Test Data: None required.

#### Steps

1. Navigate to the "Cart" page from the navigation bar.
2. Observe the page content.

#### Expected Result

1. The page displays the message "Cart is empty! Click here to buy products." instead of a product table.
2. No application error or blank page is shown.

---

### TC_CART_002 — Add products to the cart and view cart contents

- Type: Happy
- Priority: High
- Scenario: CART-S02
- Preconditions: Tester is on the Products page.
- Test Data: Two distinct products from the listing (e.g. "Blue Top", "Men Tshirt").

#### Steps

1. Add the first product to the cart from the listing page and select "Continue Shopping" on the confirmation overlay.
2. Add the second product to the cart from the listing page and select "View Cart" on the confirmation overlay.
3. Observe the cart page.

#### Expected Result

1. The tester is taken to the cart page (`/view_cart`).
2. The cart table lists both products, each with correct name, category, unit price, quantity, and line total (price × quantity).

---

### TC_CART_003 — Cart contents persist across page navigation

- Type: Happy
- Priority: Medium
- Scenario: CART-S03
- Preconditions: At least one product has been added to the cart.
- Test Data: One product added to the cart (e.g. "Blue Top").

#### Steps

1. Add a product to the cart and select "Continue Shopping".
2. Navigate to the Home page.
3. Navigate to the Cart page again.

#### Expected Result

1. The previously added product is still listed in the cart table with the same quantity and price as when it was added.

---

### TC_CART_004 — Remove a product from the cart

- Type: Happy
- Priority: High
- Scenario: CART-S04
- Preconditions: At least two products have been added to the cart.
- Test Data: Two products added to the cart.

#### Steps

1. On the cart page, select the delete (trash icon) action on the first product row.
2. Observe the cart table.

#### Expected Result

1. The selected product's row is removed from the cart table immediately, without a full page reload.
2. The remaining product(s) are still listed correctly.

## 2. Negative Cases

### TC_CART_N01 — Attempt to proceed to checkout while not logged in

- Type: Negative
- Priority: High
- Scenario: CART-S05
- Preconditions: At least one product has been added to the cart; the tester is not logged in.
- Test Data: One product added to the cart.

#### Steps

1. Add a product to the cart.
2. On the cart page, select "Proceed To Checkout".
3. Observe the resulting page content.

#### Expected Result

1. The tester remains on the cart page (`/view_cart`); no navigation to a checkout page occurs.
2. A prompt is displayed stating "Register / Login account to proceed on checkout." with "Register / Login" and "Continue On Cart" options.
3. The cart contents remain unchanged (the product is still listed).

## 3. Traceability Summary

| Scenario ID | Scenario | Test Case IDs |
|---|---|---|
| CART-S01 | View an empty cart | TC_CART_001 |
| CART-S02 | Add products to the cart and view cart contents | TC_CART_002 |
| CART-S03 | Cart contents persist across page navigation | TC_CART_003 |
| CART-S04 | Remove a product from the cart | TC_CART_004 |
| CART-S05 | Attempt to proceed to checkout while not logged in | TC_CART_N01 |
