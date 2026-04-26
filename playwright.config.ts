import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: 'https://a-dsense-blog.vercel.app',
    headless: true,
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-samsung', use: { ...devices['Galaxy S9+'] } },
  ],
});
