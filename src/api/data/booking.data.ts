import { lstat } from 'node:fs';

export const CREATE_BOOKING_REQUEST_PAYLOAD = {
  firstname: 'James',
  lastname: 'Bond',
  totalprice: 500,
  depositpaid: true,
  bookingdates: {
    checkin: '2026-01-01',
    checkout: '2026-01-10',
  },
  additionalneeds: 'Breakfast',
};

export const UPDATE_BOOKING_REQUEST_PAYLOAD = {
  firstname: 'Jason',
  lastname: 'Bourne',
  totalprice: 999,
  depositpaid: false,
  bookingdates: {
    checkin: '2026-06-01',
    checkout: '2026-06-15',
  },
  additionalneeds: 'Lunch',
};

export const PARTIAL_UPDATE_REQUEST_PAYLOAD = {
  firstname: 'Ethan',
  lastname: 'Hunt',
  additionalneeds: 'Dinner',
};

export const INVALID_BOOKING_PAYLOADS = [
  { name: 'empty object', data: {}, expectedStatus: 500 },
  {
    name: 'missing firstname',
    data: {
      lastname: 'Bond',
      totalprice: 100,
      depositpaid: true,
      bookingdates: { checkin: '2026-01-01', checkout: '2026-01-10' },
    },
    expectedStatus: 500,
  },
  {
    name: 'missing bookingdates',
    data: { firstname: 'James', lastname: 'Bond', totalprice: 100, depositpaid: true },
    expectedStatus: 500,
  },
  {
    name: 'invalid totalprice type',
    data: {
      firstname: 'James',
      lastname: 'Bond',
      totalprice: 'abc',
      depositpaid: true,
      bookingdates: { checkin: '2026-01-01', checkout: '2026-01-10' },
    },
    expectedStatus: 400,
  },
  {
    name: 'invalid date format',
    data: {
      firstname: 'James',
      lastname: 'Bond',
      totalprice: 100,
      depositpaid: true,
      bookingdates: { checkin: 'not-a-date', checkout: 'not-a-date' },
    },
    expectedStatus: 400,
  },
  {
    name: 'numeric values for string fields',
    data: {
      firstname: 12345,
      lastname: 67890,
      totalprice: 100,
      depositpaid: true,
      bookingdates: { checkin: '2026-01-01', checkout: '2026-01-10' },
      additionalneeds: 99999,
    },
    expectedStatus: 400,
  },
];
