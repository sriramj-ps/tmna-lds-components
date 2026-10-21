---
applyTo: 'packages/styles/**'
---

# Editing LDS styles (Panda CSS recipes)

- Tokens are NOT defined here. They come from the styling repo (lxc-lds-style) as `@tmna/panda-preset-base`.
  Never add `theme.tokens`, `semanticTokens` or raw values to `panda.config.ts`. A missing token is a request to
  the styling repo, followed by a preset version bump (see the `lds-update-preset` skill).
- One recipe per component in `src/recipes/<name>.ts`, exported from `src/recipes/index.ts`. `className` is the
  kebab-case name (`'icon-button'`); the export is camelCase (`iconButton`). Prefix `lds` is added by Panda.
- Always `import { defineRecipe } from '../define-recipe'`, never from `@pandacss/dev`: the wrapper type-checks
  every value against the preset's tokens (`strictTokens`). Use token keys (`paddingInline: '4'`, `color: 'black'`),
  long property names (`backgroundColor`, not `bg`) and Panda conditions (`_hover`, `_focusVisible`, `_disabled`).
- `'[13px]'` escape hatches and type casts are not allowed. If the design needs a value the preset lacks, stop
  and ask.
- Variant names and values become public class names (`lds-button--variant_primary`) used by HTML-only pages.
  Renaming or removing one is a breaking change (major version plan).
- `@pandacss/dev` and `@pandacss/preset-base` must match the version the preset's peer dependency pins exactly.
- After editing: `pnpm nx run-many -t build typecheck -p styles` must pass, then `pnpm nx build web-components`.
