# Products Test Scenarios

These scenarios cover product browsing, search, product detail viewing, and product reviews on Automation Exercise, based on direct verification of the live application (`/products`, `/category_products/*`, `/brand_products/*`, `/product_details/*`). They define **what** should be tested; step-by-step actions and expected results belong to the Test Case phase.

## 1. Product Browsing

### PROD-S01 — View all products on the Products page
Verifies that navigating to the Products page displays the full product catalog along with the category and brand navigation sidebar.

### PROD-S02 — Browse products by category
Verifies that selecting a category (and subcategory, e.g. Women > Dress) filters the listing to show only products belonging to that category, with a heading reflecting the selection.

### PROD-S03 — Browse products by brand
Verifies that selecting a brand from the sidebar filters the listing to show only products belonging to that brand, with a heading reflecting the selection.

## 2. Product Search

### PROD-S04 — Search for products using a valid keyword
Verifies that submitting a keyword that matches existing products returns a filtered "Searched Products" listing containing only matching items.

### PROD-S05 — Search for products using a keyword with no matching results
Verifies that submitting a keyword with no matching products returns the "Searched Products" view with an empty result set, without an application error.

### PROD-S06 — Search using an empty search term
Verifies the application's behavior when the search form is submitted without entering a keyword.

## 3. Product Details

### PROD-S07 — View individual product detail information
Verifies that opening a product from the listing shows its detail page with name, category, price, availability, condition, and brand.

### PROD-S08 — Add a product to the cart from the product detail page with a specified quantity
Verifies that a tester can set a custom quantity on the product detail page and add the product to the cart, receiving on-screen confirmation.

## 4. Product Reviews

### PROD-S09 — Submit a product review with valid information
Verifies that a visitor can submit a review (name, email, comment) on a product detail page and receives confirmation that the review was received.

### PROD-S10 — Submit a product review with missing required information
Verifies that the review form does not accept submission when required fields are left empty.

## 5. Scenario Coverage Summary

| ID | Area | Scenario | Priority |
|----|------|----------|----------|
| PROD-S01 | Browsing | View all products on the Products page | High |
| PROD-S02 | Browsing | Browse products by category | High |
| PROD-S03 | Browsing | Browse products by brand | Medium |
| PROD-S04 | Search | Search for products using a valid keyword | High |
| PROD-S05 | Search | Search for products using a keyword with no matching results | Medium |
| PROD-S06 | Search | Search using an empty search term | Low |
| PROD-S07 | Details | View individual product detail information | High |
| PROD-S08 | Details | Add a product to the cart with a specified quantity | High |
| PROD-S09 | Reviews | Submit a product review with valid information | Medium |
| PROD-S10 | Reviews | Submit a product review with missing required information | Low |
