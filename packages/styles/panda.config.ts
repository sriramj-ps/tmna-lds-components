import { defineConfig } from '@pandacss/dev';
import presetBase from '@tmna/panda-preset-base';
import * as recipes from './src/recipes';

export default defineConfig({
  // A broken token reference or recipe fails the build instead of printing a warning
  validation: 'error',

  // Panda's utilities and conditions (_hover, _focusVisible, ...) + TMNA's shared tokens.
  // Listing presets replaces Panda's defaults, so its base preset must be named explicitly.
  presets: ['@pandacss/preset-base', presetBase],

  // Namespace every CSS variable and class (--lds-spacing-4, .lds-button) so LDS CSS never
  // collides with other stylesheets on AEM pages.
  prefix: 'lds',

  // Only tokens, only long-form property names (matches the styling repo's AGENTS.md).
  strictTokens: true,
  shorthands: false,

  // Never reset the host page. Sites decide on their own base styles.
  preflight: false,

  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',

  // Emit every recipe variant, so plain-HTML pages and web components can use any of them
  // without Panda scanning their source.
  staticCss: { recipes: '*' },

  theme: {
    extend: {
      recipes: { ...recipes },
    },
  },
});
