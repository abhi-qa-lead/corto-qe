// These are public test credentials for the Restful Booker API sandbox.
// In production, use .env files or CI/CD secrets instead.
export const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'password123',
};

export const INVALID_CREDENTIALS = [
  { username: 'wrong', password: 'wrong' },
  { username: 'admin', password: 'wrongpassword' },
  { username: '', password: '' },
];
