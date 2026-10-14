/** Conventional Commits: feat(button): add size prop */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // scope = package or component name, kebab-case
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-case': [0],
  },
};
