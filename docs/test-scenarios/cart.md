# Cart Test Scenarios

These scenarios cover shopping cart functionality on Automation Exercise, based on direct verification of the live application (`/view_cart`, product listing "Add to cart" actions). They define **what** should be tested; step-by-step actions and expected results belong to the Test Case phase.

## 1. Cart Contents

### CART-S01 — View an empty cart
Verifies that visiting the cart page with no products added displays an appropriate empty-cart message rather than an error or a blank page.

### CART-S02 — Add products to the cart and view cart contents
Verifies that products added from the listing page appear correctly in the cart with accurate name, category, price, quantity, and line total.

### CART-S03 — Cart contents persist across page navigation
Verifies that products remain in the cart after navigating away to other pages and returning, without requiring re-adding them.

### CART-S04 — Remove a product from the cart
Verifies that a tester can remove an individual product from the cart and that it is no longer listed afterward.

## 2. Cart Access Control

### CART-S05 — Attempt to proceed to checkout while not logged in
Verifies that attempting to check out with items in the cart while not authenticated prompts the user to register or log in, without discarding the cart contents.

## 3. Scenario Coverage Summary

| ID | Area | Scenario | Priority |
|----|------|----------|----------|
| CART-S01 | Cart Contents | View an empty cart | Medium |
| CART-S02 | Cart Contents | Add products to the cart and view cart contents | High |
| CART-S03 | Cart Contents | Cart contents persist across page navigation | Medium |
| CART-S04 | Cart Contents | Remove a product from the cart | High |
| CART-S05 | Cart Access Control | Attempt to proceed to checkout while not logged in | High |
