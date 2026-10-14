import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

// Smoke-tests the generated React wrappers in a real browser.
export default defineConfig({
  test: {
    include: ['src/**/*.test.tsx'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        launchOptions: { executablePath: process.env['PW_CHROMIUM_PATH'] || undefined },
      }),
      instances: [{ browser: 'chromium' }],
    },
  },
});
