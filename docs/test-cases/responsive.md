# Responsive Layout Test Cases

These test cases implement the scenarios defined in `docs/test-scenarios/responsive.md`. Each case describes concrete tester actions and observable expected results, grounded in behavior verified directly on the live application (https://automationexercise.com/).

Every case is executed three times, once per supported viewport: 375 × 812 (phone), 768 × 1024 (tablet) and 1280 × 800 (desktop). "Within the viewport" means: after scrolling to the element, it is fully inside the viewport width, visible, and not covered by another element (ads included; closable ads are closed first). A wide table may scroll horizontally inside its own box, as long as the box fits the viewport and the page itself does not scroll horizontally.

## 1. Happy Cases

### TC_RESP_001 — Main public pages have no horizontal scroll

- Type: Happy
- Priority: High
- Scenario: RESP-S01
- Preconditions: Browser viewport set to the width under test.
- Test Data: Pages `/`, `/products`, `/product_details/1`, `/category_products/1`, `/brand_products/Polo`, `/view_cart`, `/login`, `/contact_us`, `/test_cases`, `/api_list`.

#### Steps

1. Open each page in the test data list.
2. On each page, compare the page's scrollable width with the viewport width.

#### Expected Result

1. On every page, the scrollable width is not greater than the viewport width (no horizontal scroll).

---

### TC_RESP_002 — Main menu links are visible, uncovered and open their pages

- Type: Happy
- Priority: High
- Scenario: RESP-S02
- Preconditions: Browser viewport set to the width under test; tester is not logged in.
- Test Data: Menu links Home, Products, Cart, Signup / Login, Test Cases, API Testing, Contact us.

#### Steps

1. Open the home page.
2. For each menu link in the test data, check it is within the viewport, then select it.
3. Return to the home page before the next link.

#### Expected Result

1. Every menu link is within the viewport.
2. Home opens `/`, Products opens `/products`, Cart opens `/view_cart`, Signup / Login opens `/login`, Test Cases opens `/test_cases`, API Testing opens `/api_list`, Contact us opens `/contact_us`.

---

### TC_RESP_003 — Product cards show name, price and actions within the viewport

- Type: Happy
- Priority: High
- Scenario: RESP-S03
- Preconditions: Browser viewport set to the width under test.
- Test Data: The first three product cards on the "All Products" page (`/products`).

#### Steps

1. Open the "All Products" page.
2. Scroll to each of the first three product cards.

#### Expected Result

1. Each card shows the product name and price.
2. Each card's "Add to cart" and "View Product" controls are within the viewport.

---

### TC_RESP_004 — Product grid fits the viewport width

- Type: Happy
- Priority: Medium
- Scenario: RESP-S03
- Preconditions: Browser viewport set to the width under test.
- Test Data: All product cards on the "All Products" page (`/products`).

#### Steps

1. Open the "All Products" page.
2. Record the horizontal position and width of every product card.

#### Expected Result

1. No product card extends beyond the left or right edge of the viewport.
2. The number of cards per row is recorded for the run (not asserted; no design reference exists).

---

### TC_RESP_005 — Login form can be filled and submitted

- Type: Happy
- Priority: High
- Scenario: RESP-S04
- Preconditions: Browser viewport set to the width under test; a registered account exists.
- Test Data: A newly registered account (unique email, generated password).

#### Steps

1. Open the "Signup / Login" page (`/login`).
2. Check the login email field, password field and "Login" button are within the viewport.
3. Enter the account's email and password and select "Login".

#### Expected Result

1. All login fields and the "Login" button are within the viewport.
2. The tester is taken to the home page and "Logged in as <name>" is displayed.

---

### TC_RESP_006 — Signup and account information forms can be completed

- Type: Happy
- Priority: High
- Scenario: RESP-S04
- Preconditions: Browser viewport set to the width under test; no account exists for the email used.
- Test Data: Name `QA Responsive`; a newly generated unique email; account details from `test-data/users.json` (`newUser`).

#### Steps

1. Open the "Signup / Login" page and, under "New User Signup!", enter the name and email and select "Signup".
2. On the account information form, scroll through every field and the "Create Account" button.
3. Fill in the form with the test data and select "Create Account".

#### Expected Result

1. Every signup field, account information field and the "Create Account" button is within the viewport when scrolled to.
2. The account information page has no horizontal scroll.
3. The "ACCOUNT CREATED!" heading is displayed.

---

### TC_RESP_007 — Checkout and payment forms can be completed

- Type: Happy
- Priority: High
- Scenario: RESP-S05
- Preconditions: Browser viewport set to the width under test; tester is logged in with one product in the cart.
- Test Data: Payment details: name on card = account name, card number from the `TEST_CARD_NUMBER` secret, generated CVC and future expiry date.

#### Steps

1. From the cart, select "Proceed To Checkout".
2. Check the order review box, the comment field and "Place Order" are within the viewport; select "Place Order".
3. On the payment page, check every card field and the "Pay and Confirm Order" button are within the viewport.
4. Enter the payment details and confirm the order.

#### Expected Result

1. The checkout and payment pages have no horizontal scroll.
2. The order review box fits within the viewport width; the order table inside it may scroll horizontally.
3. All checkout and payment fields and buttons are within the viewport.
4. The "Order Placed!" heading is displayed.

---

### TC_RESP_008 — Product search form can be used

- Type: Happy
- Priority: Medium
- Scenario: RESP-S06
- Preconditions: Browser viewport set to the width under test.
- Test Data: Search keyword `Top`.

#### Steps

1. Open the "All Products" page.
2. Check the search field and search button are within the viewport.
3. Enter the keyword and select the search button.

#### Expected Result

1. The search field and button are within the viewport.
2. The page heading displays "SEARCHED PRODUCTS" and at least one product is listed.

---

### TC_RESP_009 — Newsletter subscription form can be used

- Type: Happy
- Priority: Medium
- Scenario: RESP-S06
- Preconditions: Browser viewport set to the width under test.
- Test Data: A newly generated unique email address.

#### Steps

1. Open the home page and scroll to the subscription form in the footer.
2. Check the email field and subscribe button are within the viewport.
3. Enter the email and select the subscribe button.

#### Expected Result

1. The subscription field and button are within the viewport.
2. The message "You have been successfully subscribed!" is displayed within the viewport.

---

### TC_RESP_010 — Contact Us form can be filled and submitted

- Type: Happy
- Priority: Medium
- Scenario: RESP-S06
- Preconditions: Browser viewport set to the width under test.
- Test Data: Name `QA Responsive`, a newly generated unique email, subject `Responsive check`, message `Layout test at <width>px`.

#### Steps

1. Open the "Contact Us" page (`/contact_us`).
2. Check every form field and the "Submit" button are within the viewport.
3. Fill in the form, select "Submit" and accept the "Press OK to proceed!" confirmation.

#### Expected Result

1. All Contact Us fields and the "Submit" button are within the viewport.
2. The message "Success! Your details have been submitted successfully." is displayed.

---

### TC_RESP_011 — Product review form can be filled and submitted

- Type: Happy
- Priority: Medium
- Scenario: RESP-S06
- Preconditions: Browser viewport set to the width under test.
- Test Data: Product detail page `/product_details/1`; name `QA Responsive`, a newly generated unique email, review text `Responsive review`.

#### Steps

1. Open the product detail page and scroll to "Write Your Review".
2. Check the name, email and review fields and the "Submit" button are within the viewport.
3. Fill in the review form and select "Submit".

#### Expected Result

1. All review fields and the "Submit" button are within the viewport.
2. The message "Thank you for your review." is displayed.

---

### TC_RESP_012 — "Added to cart" modal fits the viewport and "View Cart" opens the cart

- Type: Happy
- Priority: High
- Scenario: RESP-S07
- Preconditions: Browser viewport set to the width under test; the cart is empty.
- Test Data: The first product on the "All Products" page.

#### Steps

1. Open the "All Products" page and select "Add to cart" on the first product.
2. When the confirmation modal appears, check the modal and its "View Cart" link are within the viewport.
3. Select "View Cart".

#### Expected Result

1. The modal is fully within the viewport and "View Cart" is visible and not covered.
2. The cart page (`/view_cart`) opens and lists the added product.

---

### TC_RESP_013 — "Added to cart" modal "Continue Shopping" closes the modal

- Type: Happy
- Priority: High
- Scenario: RESP-S07
- Preconditions: Browser viewport set to the width under test.
- Test Data: The first product on the "All Products" page.

#### Steps

1. Open the "All Products" page and select "Add to cart" on the first product.
2. Check the "Continue Shopping" button is within the viewport and select it.

#### Expected Result

1. "Continue Shopping" is visible and not covered.
2. The modal closes and the tester remains on the "All Products" page.

---

### TC_RESP_014 — Checkout login gate modal fits the viewport and its link opens the login page

- Type: Happy
- Priority: Medium
- Scenario: RESP-S08
- Preconditions: Browser viewport set to the width under test; tester is not logged in and has one product in the cart.
- Test Data: The first product on the "All Products" page.

#### Steps

1. Open the cart page and select "Proceed To Checkout".
2. Check the modal with "Register / Login account to proceed on checkout." and its "Register / Login" link are within the viewport.
3. Select "Register / Login".

#### Expected Result

1. The modal and the "Register / Login" link are within the viewport and not covered.
2. The "Signup / Login" page (`/login`) opens.

---

## 2. Negative Cases

### TC_RESP_N01 — Login error message is readable within the viewport

- Type: Negative
- Priority: Medium
- Scenario: RESP-S04
- Preconditions: Browser viewport set to the width under test.
- Test Data: A newly generated unregistered email, password `WrongPass123!`.

#### Steps

1. Open the "Signup / Login" page.
2. Enter the unregistered email and password and select "Login".

#### Expected Result

1. The message "Your email or password is incorrect!" is displayed within the viewport.
2. The tester remains on the "Signup / Login" page (`/login`).

---

## 3. Edge Cases

### TC_RESP_E01 — At 375px the wrapped menu does not cover page content

- Type: Edge
- Priority: Medium
- Scenario: RESP-S02
- Preconditions: Browser viewport 375 × 812 (this case runs at the phone width only).
- Test Data: Home page and "All Products" page.

#### Steps

1. Open the home page, then the "All Products" page.
2. On each page, compare the bottom edge of the header menu with the top edge of the first content block below it.

#### Expected Result

1. On both pages the header menu does not overlap the content below it.
2. Every menu link remains within the viewport.

---

## 4. Traceability Summary

| Scenario ID | Scenario | Test Case IDs |
|---|---|---|
| RESP-S01 | Pages have no horizontal scroll at 375px, 768px and 1280px | TC_RESP_001 |
| RESP-S02 | Main navigation menu is reachable and usable at each supported width | TC_RESP_002, TC_RESP_E01 |
| RESP-S03 | Product grid adapts to the viewport and product cards remain usable | TC_RESP_003, TC_RESP_004 |
| RESP-S04 | Account forms are usable at each supported width | TC_RESP_005, TC_RESP_006, TC_RESP_N01 |
| RESP-S05 | Checkout and payment forms are usable at each supported width | TC_RESP_007 |
| RESP-S06 | Search, subscription, contact and review forms are usable at each supported width | TC_RESP_008, TC_RESP_009, TC_RESP_010, TC_RESP_011 |
| RESP-S07 | "Added to cart" modal is fully visible and its actions are usable at each supported width | TC_RESP_012, TC_RESP_013 |
| RESP-S08 | Checkout login gate modal is fully visible and usable at each supported width | TC_RESP_014 |
