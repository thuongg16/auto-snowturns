// Machine-checked part of the test standards in .claude/rules/test-code.md.
// CI runs `npm run lint`; a rule that matters should live here, not only in prose.
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  {
    ignores: ['node_modules/', 'playwright-report/', 'test-results/', 'blob-report/'],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      // `const { name, ...rest } = obj` is the idiomatic way to drop a field.
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
  {
    // Plain Node scripts run by the CI pipeline (e.g. utils/report.js) are CommonJS.
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Hard rules: fixed sleeps and focused/skipped tests never reach main.
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'error',
      'playwright/no-page-pause': 'error',
      'playwright/no-networkidle': 'error',
      // Assertions often live in page-object helpers (e.g. homePage.expectLoggedInAs).
      'playwright/expect-expect': ['warn', { assertFunctionPatterns: ['^expect'] }],
    },
  },
);
