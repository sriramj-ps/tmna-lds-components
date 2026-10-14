import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Every story becomes a test: it must render, its play() must pass, and axe must find no violations.
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            // PW_CHROMIUM_PATH lets CI images with a preinstalled Chromium skip the download
            provider: playwright({
              launchOptions: { executablePath: process.env['PW_CHROMIUM_PATH'] || undefined },
            }),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
