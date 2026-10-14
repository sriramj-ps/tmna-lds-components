import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';

export const config: Config = {
  namespace: 'lds',
  // Modern browsers only: no ES5 bundle
  buildEs5: false,
  outputTargets: [
    // 1. Lazy-loading bundle + loader script: for AEM HTL pages and plain HTML (one <script> tag)
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    // 2. One ES module per component: for bundlers, and required by the React + Angular wrappers
    {
      type: 'dist-custom-elements',
      // Top-level components/ folder: the React and Angular wrappers import from here
      dir: 'components',
      customElementsExportBehavior: 'single-export-module',
      externalRuntime: false,
      generateTypeDeclarations: true,
    },
    // 3. Machine-readable API docs: Storybook, Figma Code Connect, AI agents, API-diff gate
    { type: 'docs-json', file: 'dist/docs.json' },
    { type: 'docs-custom-elements-manifest', file: 'dist/custom-elements.json' },
    // 4. Human-readable README per component (props, events, slots, CSS parts)
    { type: 'docs-readme', footer: '' },
    // 5. React wrappers, generated into the react package's source folder
    reactOutputTarget({
      outDir: '../react/src/generated',
      esModules: true,
    }),
    // 6. Angular standalone wrappers, generated into the angular package's source folder
    angularOutputTarget({
      componentCorePackage: '@tmna-cx-design-system/web-components',
      outputType: 'standalone',
      directivesProxyFile: '../angular/src/generated/proxies.ts',
      directivesArrayFile: '../angular/src/generated/index.ts',
      valueAccessorConfigs: [],
    }),
  ],
  // package.json is ESM-only on purpose; publint checks it in CI instead of Stencil's CJS-first defaults
  validatePrimaryPackageOutputTarget: false,
};
