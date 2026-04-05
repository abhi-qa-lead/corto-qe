import { test, expect } from '@playwright/test';
import { ApiClient } from '@helpers/api.client';
import { VALID_CREDENTIALS } from '@api/data/auth.data';
import {
  CREATE_BOOKING_REQUEST_PAYLOAD,
  UPDATE_BOOKING_REQUEST_PAYLOAD,
  PARTIAL_UPDATE_REQUEST_PAYLOAD,
} from '@api/data/booking.data';

test.describe('COR-25: E2E Flow - Restful Booker API CRUD Test', () => {
  test.describe.configure({ mode: 'serial' });

  test.describe('should complete the full booking lifecycle', () => {
    let token: string;
    let bookingId: number;

    test.beforeAll('Create Auth Token', async ({ request }) => {
      const api = new ApiClient(request);
      const response = await api.send('POST', '/auth', VALID_CREDENTIALS);
      const body = await response.json();
      expect(body.token, 'Auth should return a token').toBeDefined();
      token = body.token;
    });

    test('POST - CreateBooking - Create a new booking', async ({ request }) => {
      const api = new ApiClient(request, token);
      const response = await api.send('POST', '/booking', CREATE_BOOKING_REQUEST_PAYLOAD);
      expect(response.status(), 'Create should return 200').toBe(200);

      const body = await response.json();
      expect(body.bookingid, 'Should return a booking ID').toBeGreaterThan(0);
      expect(body.booking, 'Created booking should match submitted data').toMatchObject(
        CREATE_BOOKING_REQUEST_PAYLOAD,
      );

      bookingId = body.bookingid;
    });

    test('GET - GetBooking - Retrieve the above creted booking by bookindId', async ({
      request,
    }) => {
      const api = new ApiClient(request, token);
      const response = await api.send('GET', `/booking/${bookingId}`);
      expect(response.status(), 'Get should return 200').toBe(200);

      const body = await response.json();
      expect(body, 'Retrieved booking should match created data').toMatchObject(
        CREATE_BOOKING_REQUEST_PAYLOAD,
      );
    });

    test('PUT - UpdateBooking - Fully update the above created booking', async ({ request }) => {
      const api = new ApiClient(request, token);
      const response = await api.send(
        'PUT',
        `/booking/${bookingId}`,
        UPDATE_BOOKING_REQUEST_PAYLOAD,
      );
      expect(response.status(), 'Update should return 200').toBe(200);

      const body = await response.json();
      expect(body, 'Updated booking should match new data').toEqual(UPDATE_BOOKING_REQUEST_PAYLOAD);
    });

    test('PATCH - PartialUpdateBooking - Partially update the above created booking', async ({
      request,
    }) => {
      const api = new ApiClient(request, token);

      const beforePatch = await api.send('GET', `/booking/${bookingId}`);
      const currentBooking = await beforePatch.json();

      const response = await api.send(
        'PATCH',
        `/booking/${bookingId}`,
        PARTIAL_UPDATE_REQUEST_PAYLOAD,
      );
      expect(response.status(), 'Patch should return 200').toBe(200);

      const body = await response.json();
      expect(body.firstname, 'Firstname should be patched').toBe(
        PARTIAL_UPDATE_REQUEST_PAYLOAD.firstname,
      );
      expect(body.additionalneeds, 'Additional needs should be patched').toBe(
        PARTIAL_UPDATE_REQUEST_PAYLOAD.additionalneeds,
      );
      expect(body.totalprice, 'Unchanged fields should persist').toBe(currentBooking.totalprice);
    });

    test('DELETE - DeleteBooking - Delete the above created booking', async ({ request }) => {
      const api = new ApiClient(request, token);
      const response = await api.send('DELETE', `/booking/${bookingId}`);
      expect(response.status(), 'Delete should return 201').toBe(201);
    });

    test('GET - ConfirmBookingIsDeleted - Confirm the booking is deleted', async ({ request }) => {
      const api = new ApiClient(request, token);
      const response = await api.send('GET', `/booking/${bookingId}`);
      expect(response.status(), 'Deleted booking should return 404').toBe(404);
    });
  });
});
