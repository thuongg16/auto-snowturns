import { test, expect } from '../../fixtures/test-fixtures';
import { buildApiAccountPayload, generateUniqueEmail } from '../../utils/helpers';

// docs/test-cases/api.md — Section 1 (Happy: TC_API_004), Section 2 (Negative: N04-N06)

test('TC_API_004 — POST verifyLogin with valid, registered credentials confirms the user exists', async ({
  request,
}) => {
  const email = generateUniqueEmail('api_login_tc004');
  const payload = buildApiAccountPayload(email);
  await request.post('/api/createAccount', { form: payload });

  const response = await request.post('/api/verifyLogin', {
    form: { email, password: payload.password },
  });
  const body = await response.json();

  expect(body.responseCode).toBe(200);
  expect(body.message).toBe('User exists!');
});

test('TC_API_N04 — POST verifyLogin with non-matching credentials returns a 404 response code', async ({
  request,
}) => {
  const response = await request.post('/api/verifyLogin', {
    form: { email: generateUniqueEmail('api_login_n04'), password: 'whatever123' },
  });
  const body = await response.json();

  expect(body.responseCode).toBe(404);
  expect(body.message).toBe('User not found!');
});

test('TC_API_N05 — POST verifyLogin with a missing parameter returns a 400 response code', async ({
  request,
}) => {
  const response = await request.post('/api/verifyLogin', {
    form: { email: generateUniqueEmail('api_login_n05') },
  });
  const body = await response.json();

  expect(body.responseCode).toBe(400);
  expect(body.message).toContain('email or password');
});

test('TC_API_N06 — DELETE verifyLogin (unsupported method) returns a 405 response code', async ({
  request,
}) => {
  const response = await request.delete('/api/verifyLogin');
  const body = await response.json();

  expect(body.responseCode).toBe(405);
  expect(body.message).toBe('This request method is not supported.');
});
