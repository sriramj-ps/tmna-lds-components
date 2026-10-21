---
name: lds-update-preset
description: Bring a new version of the TMNA Panda preset (@tmna/panda-preset-base, from the lxc-lds-style styling repo) into LDS, or handle a request for a token that LDS doesn't have. USE WHEN asked to update, add, change or remove a token, colour, spacing, radius or typography value, to sync tokens from Figma, or to bump the styling repo / preset version.
---

# Update the TMNA preset (tokens)

## Rules

- Tokens live in the styling repo (lxc-lds-style), not here. LDS only consumes `@tmna/panda-preset-base`.
- A token that doesn't exist yet is added in the styling repo first (open a PR or ticket there). Never work around
  it with a raw value or a `theme.tokens` entry in `packages/styles/panda.config.ts`.
- `@pandacss/dev` and `@pandacss/preset-base` in `pnpm-workspace.yaml` (catalog) must equal the exact Panda
  version in the preset's `peerDependencies`.

## Steps

1. Get the new preset version:
   - published to JFrog: set `"@tmna/panda-preset-base": "<version>"` in `packages/styles/package.json`
     (devDependencies) and delete `vendor/` once nothing points at it;
   - not published yet: in the styling repo run `pnpm --filter @tmna/panda-preset-base build && pnpm --filter
@tmna/panda-preset-base pack`, replace the tarball in `vendor/`, and update the `file:` path if the
     version in the file name changed.
2. Compare the preset's `peerDependencies['@pandacss/dev']` with the catalog. If it moved, update both Panda
   entries in `pnpm-workspace.yaml` to that exact version.
3. Install and rebuild:

   ```bash
   pnpm install
   pnpm nx run-many -t build typecheck -p styles     # a removed or renamed token fails typecheck here
   pnpm nx run-many -t build lint stylelint typecheck test
   ```

4. Classify the change:
   - token value changed → visual tests fail where components look different. Check each one is intended, then
     accept with `pnpm nx test web-components -- -u` → patch or minor
   - new tokens only → minor
   - a token LDS uses was renamed or removed → fix every recipe in `packages/styles/src/recipes/` in the same PR
     → major if any recipe class or variant changes
5. Add a version plan (`pnpm nx release plan <patch|minor|major> -m "..."`) describing the visible change.
