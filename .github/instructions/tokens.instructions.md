---
applyTo: 'packages/tokens/src/**'
---

# Editing design tokens

- Format is W3C DTCG 2025.10: `$value`, `$type`; colours are `{ "colorSpace": "srgb", "components": [...], "hex": "#..." }`,
  dimensions are `{ "value": 16, "unit": "px" }`.
- `src/primitives/` holds raw palette/scales. `src/brands/<brand>.tokens.json` holds semantic tokens that reference primitives.
- Every semantic token must exist in **every** brand file with the same path. Values may differ; names may not.
- Never add `$description` at the top level of a file (Style Dictionary reports a collision). Put it on a group.
- Renaming or removing a semantic token is a breaking change (major version plan).
- After editing: `pnpm nx build tokens` must pass with no warnings (warnings are errors).
