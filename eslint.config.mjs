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
            { sourceTag: 'type:tokens', onlyDependOnLibsWithTags: [] },
            { sourceTag: 'type:foundation', onlyDependOnLibsWithTags: ['type:tokens'] },
            {
              sourceTag: 'level:core',
              onlyDependOnLibsWithTags: ['type:tokens', 'type:foundation', 'type:icons'],
            },
            {
              sourceTag: 'level:organism',
              onlyDependOnLibsWithTags: [
                'level:core',
                'type:tokens',
                'type:foundation',
                'type:icons',
              ],
            },
            { sourceTag: 'type:wrapper', onlyDependOnLibsWithTags: ['type:components'] },
            { sourceTag: 'type:tool', onlyDependOnLibsWithTags: ['type:tool', 'type:tokens'] },
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
