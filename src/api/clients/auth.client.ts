import { type APIRequestContext } from '@playwright/test';

export class AuthClient {
  constructor(private request: APIRequestContext) {}

  async createToken(credentials: { username: string; password: string }) {
    return this.request.post('/auth', {
      data: credentials,
    });
  }
}
