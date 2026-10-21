import nx from '@nx/eslint-plugin';

export default [
  // Nx base rules + TypeScript + JavaScript presets
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    // Generated or built files are never linted
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/www',
      '**/loader',
      '**/storybook-static',
      '**/components.d.ts',
      '**/src/generated/**',
      '**/vite.config.*.timestamp*',
      '**/.stencil',
      // Panda codegen output (packages/styles)
      '**/styled-system',
      'packages/web-components/components',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          // Who may import whom. Lower layers never import higher ones.
          depConstraints: [
            // Recipes + the TMNA Panda preset (lxc-lds-style). The bottom layer.
            { sourceTag: 'type:styles', onlyDependOnLibsWithTags: [] },
            {
              sourceTag: 'level:core',
              onlyDependOnLibsWithTags: ['type:styles', 'type:icons'],
            },
            {
              sourceTag: 'level:organism',
              onlyDependOnLibsWithTags: ['level:core', 'type:styles', 'type:icons'],
            },
            { sourceTag: 'type:wrapper', onlyDependOnLibsWithTags: ['type:components'] },
            { sourceTag: 'type:tool', onlyDependOnLibsWithTags: ['type:tool', 'type:styles'] },
            { sourceTag: 'type:app', onlyDependOnLibsWithTags: ['*'] },
          ],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Build scripts and tools may log progress
    files: ['**/build.mjs', '**/scripts/**', 'tools/**'],
    rules: { 'no-console': 'off' },
  },
  {
    // Stencil JSX: `h` is used by the compiler even though it looks unused
    files: ['packages/web-components/**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^(h|Fragment)$' }],
    },
  },
];
