# Responsive Layout Test Scenarios

These scenarios cover layout and usability of Automation Exercise at three viewport widths — 375px (phone), 768px (tablet) and 1280px (desktop) — across the main pages (`/`, `/products`, `/product_details/<id>`, `/view_cart`, `/login`, `/signup`, `/checkout`, `/payment`, `/contact_us`, `/test_cases`, `/api_list`), based on direct verification of the live application. They define **what** should be tested; step-by-step actions and expected results belong to the Test Case phase.

## 1. Page Layout

### RESP-S01 — Pages have no horizontal scroll at 375px, 768px and 1280px
Verifies that at each supported width the page content fits the viewport horizontally, so no page requires sideways scrolling.

## 2. Navigation

### RESP-S02 — Main navigation menu is reachable and usable at each supported width
Verifies that every main menu link (Home, Products, Cart, Signup / Login, Test Cases, API Testing, Video Tutorials, Contact us) is visible, not overlapped, and navigates to its page at each supported width, even though the menu wraps instead of collapsing on small screens.

## 3. Product Grid

### RESP-S03 — Product grid adapts to the viewport and product cards remain usable
Verifies that on the home and Products pages the product grid rearranges to the available width and that each product card's name, price, "Add to cart" and "View Product" controls stay visible and usable.

## 4. Forms

### RESP-S04 — Account forms are usable at each supported width
Verifies that the login, signup and account information forms can be filled and submitted at each supported width, with every field and submit button reachable and operable.

### RESP-S05 — Checkout and payment forms are usable at each supported width
Verifies that an authenticated user can review the order, enter a comment and complete the payment form at each supported width, with every field and action button reachable and operable.

### RESP-S06 — Search, subscription, contact and review forms are usable at each supported width
Verifies that the product search, newsletter subscription, Contact Us and product review forms can be filled and submitted at each supported width.

## 5. Modals

### RESP-S07 — "Added to cart" modal is fully visible and its actions are usable at each supported width
Verifies that after adding a product to the cart the confirmation modal fits within the viewport and its "View Cart" and "Continue Shopping" actions are visible and clickable at each supported width.

### RESP-S08 — Checkout login gate modal is fully visible and usable at each supported width
Verifies that a guest who proceeds to checkout sees the "Register / Login account to proceed on checkout." modal within the viewport, with its "Register / Login" link reachable and clickable at each supported width.

## 6. Scenario Coverage Summary

| ID | Area | Scenario | Priority |
|----|------|----------|----------|
| RESP-S01 | Page Layout | Pages have no horizontal scroll at 375px, 768px and 1280px | High |
| RESP-S02 | Navigation | Main navigation menu is reachable and usable at each supported width | High |
| RESP-S03 | Product Grid | Product grid adapts to the viewport and product cards remain usable | High |
| RESP-S04 | Forms | Account forms are usable at each supported width | High |
| RESP-S05 | Forms | Checkout and payment forms are usable at each supported width | High |
| RESP-S06 | Forms | Search, subscription, contact and review forms are usable at each supported width | Medium |
| RESP-S07 | Modals | "Added to cart" modal is fully visible and its actions are usable at each supported width | High |
| RESP-S08 | Modals | Checkout login gate modal is fully visible and usable at each supported width | Medium |
