---
name: lds-update-tokens
description: Update LDS design tokens from a Figma Variables export or a designer request, keeping every brand in sync and flagging breaking changes. USE WHEN asked to add, change, rename or remove a token, colour, spacing, radius or typography value, or to sync tokens from Figma.
---

# Update design tokens

## Rules

- Tokens are W3C DTCG JSON in `packages/tokens/src/`. See `.github/instructions/tokens.instructions.md`.
- Semantic tokens (`src/brands/*.tokens.json`) must have identical names in every brand file.
- Components reference semantic tokens only, never `palette.*`.

## Steps

1. If given a Figma export (DTCG JSON per mode), map Figma modes to brand files: `Toyota` → `toyota.tokens.json`,
   `Lexus` → `lexus.tokens.json`. Keep the existing file structure; do not paste the export wholesale.
2. Classify each change:
   - value change of an existing token → patch or minor
   - new token → minor
   - rename or removal → **major**; search `packages/` for `--lds-<old-name>` and update every usage in the same PR
3. Edit the files, then run:

   ```bash
   pnpm nx build tokens
   pnpm nx run-many -t build stylelint test
   ```

4. Visual tests will fail where components changed appearance. Check each failure is intended, then accept with
   `pnpm nx test web-components -- -u`.
5. Add a version plan (`pnpm nx release plan <patch|minor|major>`) describing the visible change per brand.
