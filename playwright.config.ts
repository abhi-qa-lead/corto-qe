import { defineConfig, devices } from '@playwright/test';
import type { GitHubActionOptions } from '@estruyf/github-actions-reporter';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ['./src/helpers/spec.reporter.ts'],
        ['html'],
        [
          '@estruyf/github-actions-reporter',
          <GitHubActionOptions>{
            title: 'Corto QE Test Results',
            useDetails: true,
            showError: true,
          },
        ],
      ]
    : [['./src/helpers/spec.reporter.ts'], ['html']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'ui-tests',
      testDir: './tests/ui',
      use: {
        baseURL: 'https://demoqa.com',
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
      },
    },
  ],
});
