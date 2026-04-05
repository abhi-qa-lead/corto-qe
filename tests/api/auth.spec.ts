import { test, expect } from '@playwright/test';
import { ApiClient } from '@helpers/api.client';
import { VALID_CREDENTIALS, INVALID_CREDENTIALS } from '@api/data/auth.data';

test.describe('COR-23: POST /auth - Create Token', () => {
  let api: ApiClient;

  test.beforeEach(async ({ request }) => {
    api = new ApiClient(request);
  });

  test('should return a token with valid credentials', async () => {
    const response = await api.send('POST', '/auth', VALID_CREDENTIALS);

    expect(response.status(), 'Auth should return 200').toBe(200);

    const body = await response.json();
    expect(body.token, 'Response should contain a token string').toBeDefined();
    expect(typeof body.token, 'Token should be a string').toBe('string');
    expect(body.token.length, 'Token should not be empty').toBeGreaterThan(0);
  });

  for (const [index, credentials] of INVALID_CREDENTIALS.entries()) {
    test(`should reject invalid credentials : ${JSON.stringify(credentials)}`, async () => {
      const response = await api.send('POST', '/auth', credentials);

      expect(response.status(), 'Auth should return 200 even for bad credentials').toBe(200);

      const body = await response.json();
      expect(body.reason, 'Response should contain rejection reason').toBe('Bad credentials');
      expect(body.token, 'Response should not contain a token').toBeUndefined();
    });
  }
});
