# Products Test Cases

These test cases implement the scenarios defined in `docs/test-scenarios/products.md`. Each case describes concrete tester actions and observable expected results, grounded in behavior verified directly on the live application (https://automationexercise.com/).

## 1. Happy Cases

### TC_PROD_001 — View all products on the Products page

- Type: Happy
- Priority: High
- Scenario: PROD-S01
- Preconditions: Tester has access to the Automation Exercise home page.
- Test Data: None required.

#### Steps

1. Navigate to the home page.
2. Select "Products" from the navigation bar.
3. Observe the page content.

#### Expected Result

1. The tester is taken to the "All Products" page (`/products`).
2. A grid of product cards is displayed, each showing an image, name, price, and an "Add to cart" option.
3. The left sidebar displays a "CATEGORY" section (Women, Men, Kids) and a "BRANDS" section with brand names and product counts.

---

### TC_PROD_002 — Browse products by category

- Type: Happy
- Priority: High
- Scenario: PROD-S02
- Preconditions: Tester is on the Products page.
- Test Data: Category: `Women`, Subcategory: `Dress`

#### Steps

1. On the Products page, select "Women" in the category sidebar.
2. Select the "Dress" subcategory link that appears.
3. Observe the resulting page.

#### Expected Result

1. The tester is taken to a category-filtered page (URL changes to `/category_products/<id>`).
2. The page heading reflects the selected category and subcategory (e.g. "WOMEN - Dress PRODUCTS").
3. Only products belonging to the selected category/subcategory are displayed.

---

### TC_PROD_003 — Browse products by brand

- Type: Happy
- Priority: Medium
- Scenario: PROD-S03
- Preconditions: Tester is on the Products page.
- Test Data: Brand: `Polo`

#### Steps

1. On the Products page, select "Polo" in the "BRANDS" sidebar section.
2. Observe the resulting page.

#### Expected Result

1. The tester is taken to a brand-filtered page (URL changes to `/brand_products/Polo`).
2. The page heading reflects the selected brand (e.g. "BRAND - Polo PRODUCTS").
3. Only products belonging to the selected brand are displayed.

---

### TC_PROD_004 — Search for products using a valid keyword

- Type: Happy
- Priority: High
- Scenario: PROD-S04
- Preconditions: Tester is on the Products page.
- Test Data: Search term: `Dress`

#### Steps

1. On the Products page, enter "Dress" into the search field.
2. Select the search (magnifying glass) button.
3. Observe the resulting page.

#### Expected Result

1. The URL changes to reflect the search query (e.g. `/products?search=Dress`).
2. The page heading displays "SEARCHED PRODUCTS".
3. Only products whose name matches the search term are displayed in the results grid.

---

### TC_PROD_005 — View individual product detail information

- Type: Happy
- Priority: High
- Scenario: PROD-S07
- Preconditions: Tester is on the Products page.
- Test Data: Any listed product (e.g. "Blue Top").

#### Steps

1. On the Products page, select "View Product" for a product.
2. Observe the resulting page.

#### Expected Result

1. The tester is taken to a product detail page (URL changes to `/product_details/<id>`).
2. The page displays the product's name, category, price, a quantity selector with an "Add to cart" button, availability, condition, and brand.

---

### TC_PROD_006 — Add a product to the cart with a specified quantity from the detail page

- Type: Happy
- Priority: High
- Scenario: PROD-S08
- Preconditions: Tester is on a product detail page.
- Test Data: Quantity: `4`

#### Steps

1. On a product detail page, clear the quantity field and enter `4`.
2. Select "Add to cart".
3. Observe the resulting confirmation.

#### Expected Result

1. A confirmation overlay is displayed with the message "Added! Your product has been added to cart."
2. The overlay presents "View Cart" and "Continue Shopping" options.

---

### TC_PROD_007 — Submit a product review with valid information

- Type: Happy
- Priority: Medium
- Scenario: PROD-S09
- Preconditions: Tester is on a product detail page.
- Test Data:
  - Name: `QA Reviewer`
  - Email: a valid, newly generated address, e.g. `auth_review_<timestamp>@example.com`
  - Review text: `This is a great product for testing purposes.`

#### Steps

1. On a product detail page, select the "Write Your Review" tab.
2. Enter the test Name, Email, and Review text.
3. Select "Submit".

#### Expected Result

1. The message "Thank you for your review." is displayed on the page.
2. No page navigation or error occurs; the tester remains on the product detail page.

## 2. Negative Cases

### TC_PROD_N01 — Search for products using a keyword with no matching results

- Type: Negative
- Priority: Medium
- Scenario: PROD-S05
- Preconditions: Tester is on the Products page.
- Test Data: Search term: `zzzznoproduct123` (a value not expected to match any product name)

#### Steps

1. On the Products page, enter the non-matching search term into the search field.
2. Select the search button.
3. Observe the resulting page.

#### Expected Result

1. The page heading still displays "SEARCHED PRODUCTS".
2. No product cards are displayed in the results grid.
3. No application error page or broken layout is shown.

---

### TC_PROD_N02 — Submit a product review with missing required information

- Type: Negative
- Priority: Low
- Scenario: PROD-S10
- Preconditions: Tester is on a product detail page.
- Test Data: Name, Email, and Review fields left empty.

#### Steps

1. On a product detail page, select the "Write Your Review" tab.
2. Leave the Name, Email, and Review fields empty.
3. Select "Submit".

#### Expected Result

1. The form is not submitted; the browser's native required-field validation flags the empty field(s).
2. The "Thank you for your review." confirmation message does not appear.

## 3. Edge Cases

### TC_PROD_E01 — Search using an empty search term

- Type: Edge
- Priority: Low
- Scenario: PROD-S06
- Preconditions: Tester is on the Products page.
- Test Data: Search term: empty string.

#### Steps

1. On the Products page, leave the search field empty.
2. Select the search button.
3. Observe the resulting page.

#### Expected Result

1. The URL changes to include an empty search parameter (e.g. `/products?search=`).
2. The full, unfiltered product catalog (all products) is displayed, rather than an empty result set or an error.

## 4. Traceability Summary

| Scenario ID | Scenario | Test Case IDs |
|---|---|---|
| PROD-S01 | View all products on the Products page | TC_PROD_001 |
| PROD-S02 | Browse products by category | TC_PROD_002 |
| PROD-S03 | Browse products by brand | TC_PROD_003 |
| PROD-S04 | Search for products using a valid keyword | TC_PROD_004 |
| PROD-S05 | Search for products using a keyword with no matching results | TC_PROD_N01 |
| PROD-S06 | Search using an empty search term | TC_PROD_E01 |
| PROD-S07 | View individual product detail information | TC_PROD_005 |
| PROD-S08 | Add a product to the cart with a specified quantity | TC_PROD_006 |
| PROD-S09 | Submit a product review with valid information | TC_PROD_007 |
| PROD-S10 | Submit a product review with missing required information | TC_PROD_N02 |
