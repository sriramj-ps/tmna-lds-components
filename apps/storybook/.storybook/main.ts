import type { StorybookConfig } from '@storybook/web-components-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  framework: '@storybook/web-components-vite',
  stories: [
    // Usage guides for consuming teams (HTML/AEM, React, Angular, customising, browser support)
    '../docs/*.mdx',
    // Stories live next to the components they describe
    '../../../packages/web-components/src/**/*.stories.ts',
  ],
  addons: [
    // remark-gfm: tables in the guides
    {
      name: '@storybook/addon-docs',
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  core: { disableTelemetry: true },
};

export default config;
