import { test, expect } from '@playwright/test';
import { ApiClient } from '@helpers/api.client';
import { CREATE_BOOKING_REQUEST_PAYLOAD } from '@api/data/booking.data';

test.describe('COR-27: GET /booking - Filters and edge cases', () => {
  test.describe.configure({ mode: 'serial' });

  let api: ApiClient;
  let bookingId: number;

  test.beforeAll(async ({ request }) => {
    api = new ApiClient(request);
    const response = await api.send('POST', '/booking', CREATE_BOOKING_REQUEST_PAYLOAD);
    const body = await response.json();
    bookingId = body.bookingid;
  });

  test('should return booking IDs when filtering by firstname and lastname', async ({
    request,
  }) => {
    api = new ApiClient(request);
    const { firstname, lastname } = CREATE_BOOKING_REQUEST_PAYLOAD;
    const response = await api.send('GET', `/booking?firstname=${firstname}&lastname=${lastname}`);
    expect(response.status(), 'Filter by name should return 200').toBe(200);

    const body = await response.json();
    expect(Array.isArray(body), 'Response should be an array').toBe(true);
    const ids = body.map((b: { bookingid: number }) => b.bookingid);
    expect(ids, 'Filtered results should include the created booking').toContain(bookingId);
  });

  test('should return booking IDs when filtering by checkin and checkout dates', async ({
    request,
  }) => {
    api = new ApiClient(request);
    const response = await api.send('GET', '/booking?checkin=2025-01-01&checkout=2027-01-01');
    expect(response.status(), 'Filter by dates should return 200').toBe(200);

    const body = await response.json();
    expect(Array.isArray(body), 'Response should be an array').toBe(true);
    expect(body.length, 'Should return at least one result').toBeGreaterThan(0);
  });

  test('should return empty array when filtering by non-existent name', async ({ request }) => {
    api = new ApiClient(request);
    const response = await api.send('GET', '/booking?firstname=ZZZNonExistent&lastname=ZZZNobody');
    expect(response.status(), 'Filter should return 200').toBe(200);

    const body = await response.json();
    expect(body, 'Should return empty array for non-existent name').toEqual([]);
  });

  test('should return 404 for non-existent booking ID @negative', async ({ request }) => {
    api = new ApiClient(request);
    const response = await api.send('GET', '/booking/99999999');
    expect(response.status(), 'Non-existent ID should return 404').toBe(404);
  });
});
