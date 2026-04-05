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
