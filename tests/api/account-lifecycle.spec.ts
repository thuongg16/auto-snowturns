import { test, expect } from '../../fixtures/test-fixtures';
import { buildApiAccountPayload, generateUniqueEmail } from '../../utils/helpers';

// docs/test-cases/api.md — Section 1 (Happy: TC_API_005-008), Section 2 (Negative: N07)

test('TC_API_005 — POST createAccount creates a new user', async ({ request }) => {
  const payload = buildApiAccountPayload(generateUniqueEmail('api_tc005'));

  const response = await request.post('/api/createAccount', { form: payload });
  const body = await response.json();

  expect(body.responseCode).toBe(201);
  expect(body.message).toBe('User created!');
});

test('TC_API_006 — GET getUserDetailByEmail retrieves the created user\'s details', async ({
  request,
}) => {
  const email = generateUniqueEmail('api_tc006');
  const payload = buildApiAccountPayload(email);
  await request.post('/api/createAccount', { form: payload });

  const response = await request.get(`/api/getUserDetailByEmail?email=${encodeURIComponent(email)}`);
  const body = await response.json();

  expect(body.responseCode).toBe(200);
  expect(body.user).toEqual(
    expect.objectContaining({
      name: payload.name,
      email,
      first_name: payload.firstname,
      last_name: payload.lastname,
      address1: payload.address1,
      city: payload.city,
      zipcode: payload.zipcode,
    }),
  );
});

test('TC_API_007 — PUT updateAccount updates the user\'s details', async ({ request }) => {
  const email = generateUniqueEmail('api_tc007');
  const payload = buildApiAccountPayload(email);
  await request.post('/api/createAccount', { form: payload });

  const updatedPayload = {
    ...payload,
    name: 'QA Api Updated',
    firstname: 'QAUpdated',
    lastname: 'ApiUpdated',
    address1: '456 Updated Street',
    city: 'San Francisco',
    zipcode: '94105',
    mobile_number: '9876543210',
  };
  const updateResponse = await request.put('/api/updateAccount', { form: updatedPayload });
  const updateBody = await updateResponse.json();

  expect(updateBody.responseCode).toBe(200);
  expect(updateBody.message).toBe('User updated!');

  const detailResponse = await request.get(`/api/getUserDetailByEmail?email=${encodeURIComponent(email)}`);
  const detailBody = await detailResponse.json();
  expect(detailBody.user).toEqual(
    expect.objectContaining({
      name: updatedPayload.name,
      first_name: updatedPayload.firstname,
      last_name: updatedPayload.lastname,
      address1: updatedPayload.address1,
      city: updatedPayload.city,
      zipcode: updatedPayload.zipcode,
    }),
  );
});

test('TC_API_008 — DELETE deleteAccount removes the user', async ({ request }) => {
  const email = generateUniqueEmail('api_tc008');
  const payload = buildApiAccountPayload(email);
  await request.post('/api/createAccount', { form: payload });

  const response = await request.delete('/api/deleteAccount', {
    form: { email, password: payload.password },
  });
  const body = await response.json();

  expect(body.responseCode).toBe(200);
  expect(body.message).toBe('Account deleted!');
});

test('TC_API_N07 — POST verifyLogin after account deletion returns a 404 response code', async ({
  request,
}) => {
  const email = generateUniqueEmail('api_n07');
  const payload = buildApiAccountPayload(email);
  await request.post('/api/createAccount', { form: payload });

  const deleteResponse = await request.delete('/api/deleteAccount', {
    form: { email, password: payload.password },
  });
  const deleteBody = await deleteResponse.json();
  expect(deleteBody.responseCode).toBe(200);

  const loginResponse = await request.post('/api/verifyLogin', {
    form: { email, password: payload.password },
  });
  const loginBody = await loginResponse.json();

  expect(loginBody.responseCode).toBe(404);
  expect(loginBody.message).toBe('User not found!');
});
