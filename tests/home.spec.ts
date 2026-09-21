import { test, expect } from '../fixtures/test-fixtures';

test('Home page loads and displays the expected title', async ({ page, homePage }) => {
  await homePage.goto();

  await expect(page).toHaveTitle(/Automation Exercise/);
});
