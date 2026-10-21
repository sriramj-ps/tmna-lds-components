// Defines every LDS custom element in one import:
//
//   import '@tmna-cx-design-system/web-components/register';
//
// Simplest setup for apps with a bundler. When bundle size matters, import only what the page
// uses instead: `import { defineCustomElement } from '@tmna-cx-design-system/web-components/components/lds-button.js'`.
// Pages without a bundler (AEM HTL) use the lazy loader script (dist/lds/lds.esm.js) instead.
//
// Safe to load twice: Stencil's defineCustomElement skips tags that are already defined.
// Listed in package.json `sideEffects`, so production builds keep it.
import * as lds from '../components/index.js';

for (const [name, define] of Object.entries(lds)) {
  if (name.startsWith('defineCustomElement')) define();
}
