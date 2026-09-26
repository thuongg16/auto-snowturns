import { test, expect } from '../../fixtures/test-fixtures';

// docs/test-cases/api.md — Section 1 (Happy: TC_API_001-002), Section 2 (Negative: N01-N02),
// Section 3 (Edge: E01)

test('TC_API_001 — GET productsList returns the full product list', { tag: ['@smoke', '@critical'] }, async ({ request }) => {
  const response = await request.get('/api/productsList');
  const body = await response.json();

  expect(body.responseCode).toBe(200);
  expect(Array.isArray(body.products)).toBe(true);
  expect(body.products[0]).toEqual(
    expect.objectContaining({
      id: expect.anything(),
      name: expect.any(String),
      price: expect.any(String),
      brand: expect.any(String),
      category: expect.anything(),
    }),
  );
});

test('TC_API_002 — GET brandsList returns the full brand list', async ({ request }) => {
  const response = await request.get('/api/brandsList');
  const body = await response.json();

  expect(body.responseCode).toBe(200);
  expect(Array.isArray(body.brands)).toBe(true);
  expect(body.brands[0]).toEqual(
    expect.objectContaining({ id: expect.anything(), brand: expect.any(String) }),
  );
});

test('TC_API_N01 — POST productsList (unsupported method) returns a 405 response code', async ({
  request,
}) => {
  const response = await request.post('/api/productsList');
  const body = await response.json();

  expect(body.responseCode).toBe(405);
  expect(body.message).toBe('This request method is not supported.');
});

test('TC_API_N02 — PUT brandsList (unsupported method) returns a 405 response code', async ({
  request,
}) => {
  const response = await request.put('/api/brandsList');
  const body = await response.json();

  expect(body.responseCode).toBe(405);
  expect(body.message).toBe('This request method is not supported.');
});

test('TC_API_E01 — API responses use HTTP 200 as the transport status regardless of logical outcome', async ({
  request,
}) => {
  const successResponse = await request.get('/api/productsList');
  const errorResponse = await request.post('/api/productsList');

  expect(successResponse.status()).toBe(200);
  expect(errorResponse.status()).toBe(200);

  const successBody = await successResponse.json();
  const errorBody = await errorResponse.json();
  expect(successBody.responseCode).toBe(200);
  expect(errorBody.responseCode).toBe(405);
});
