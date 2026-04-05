import { test, expect } from '@playwright/test';
import { ApiClient } from '@helpers/api.client';
import { INVALID_BOOKING_PAYLOADS } from '@api/data/booking.data';

test.describe('COR-26: POST /booking - Negative scenarios', () => {
  let api: ApiClient;

  test.beforeEach(async ({ request }) => {
    api = new ApiClient(request);
  });

  for (const { name, data, expectedStatus } of INVALID_BOOKING_PAYLOADS) {
    test(`should reject booking with ${name} @negative`, async () => {
      const response = await api.send('POST', '/booking', data);
      expect(response.status(), `Status for ${name}`).toBe(expectedStatus);
    });
  }
});
