import { type APIRequestContext } from '@playwright/test';

export class ApiClient {
  constructor(
    private request: APIRequestContext,
    private token?: string,
  ) {}

  private headers(): { [key: string]: string } | undefined {
    return this.token ? { Cookie: `token=${this.token}`, Accept: 'application/json' } : undefined;
  }

  async send(method: string, path: string, data?: object) {
    return this.request.fetch(path, {
      method,
      headers: this.headers(),
      data,
    });
  }
}
