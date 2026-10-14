import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

// Real-browser tests for the built components: behaviour + visual regression screenshots.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({
        launchOptions: { executablePath: process.env['PW_CHROMIUM_PATH'] || undefined },
      }),
      instances: [{ browser: 'chromium', viewport: { width: 640, height: 360 } }],
      expect: {
        toMatchScreenshot: {
          // Small anti-aliasing differences are OK; layout or colour changes are not
          comparatorName: 'pixelmatch',
          comparatorOptions: { threshold: 0.2, allowedMismatchedPixelRatio: 0.01 },
        },
      },
    },
  },
});
