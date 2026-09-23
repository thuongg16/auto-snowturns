import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const baseURL = process.env.BASE_URL || 'https://automationexercise.com/';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /*
   * automationexercise.com is a shared public demo site that occasionally
   * returns a "queue full / under heavy load" response under concurrent
   * traffic (see docs/test-plans/test-plan.md, Risks). One retry absorbs
   * that environmental flakiness without masking real failures, which
   * still fail on the second attempt.
   */
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  use: {
    /* Overridable via `BASE_URL=... npx playwright test` for other environments. */
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // API tests hit the backend directly and render nothing browser-specific,
    // so they run once here instead of being tripled across UI browsers.
    {
      name: 'api',
      testMatch: /tests\/api\//,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /tests\/api\//,
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    //   testIgnore: /tests\/api\//,
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    //   testIgnore: /tests\/api\//,
    // },
  ],
});
