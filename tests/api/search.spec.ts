import { test, expect } from '../../fixtures/test-fixtures';

// docs/test-cases/api.md — Section 1 (Happy: TC_API_003), Section 2 (Negative: N03)

test('TC_API_003 — POST searchProduct with a valid parameter returns matching products', async ({
  request,
}) => {
  const response = await request.post('/api/searchProduct', { form: { search_product: 'top' } });
  const body = await response.json();

  expect(body.responseCode).toBe(200);
  expect(Array.isArray(body.products)).toBe(true);
  expect(body.products.length).toBeGreaterThan(0);
});

test('TC_API_N03 — POST searchProduct with a missing parameter returns a 400 response code', async ({
  request,
}) => {
  const response = await request.post('/api/searchProduct', { form: {} });
  const body = await response.json();

  expect(body.responseCode).toBe(400);
  expect(body.message).toContain('search_product');
});
