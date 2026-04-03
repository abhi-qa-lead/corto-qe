import { defineConfig, devices } from '@playwright/test'

process.env.TEST_SEED ??= Date.now().toString()

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
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
})
