---
name: lds-new-component
description: Build a new LDS web component (optionally from a Figma node) end to end - generator, implementation with tokens, stories, visual test, and all quality gates. USE WHEN asked to create, scaffold or implement a component, atom, molecule or organism, or to turn a Figma design into a component.
---

# Build a new LDS component

Follow these steps in order. Do not skip the verification step.

## 1. Understand the design

- If a Figma link is given and the Figma MCP server is available, call `get_design_context` for the node
  and `get_variable_defs` to see which Figma variables it uses. Treat the returned code as a reference only.
- Map every colour, spacing, radius and type value to an existing semantic token in
  `packages/tokens/src/brands/toyota.tokens.json`. Search there first.
- If a value has no token, STOP and ask whether a new semantic token should be added (it must be added to
  every brand file). Never hard-code the value.
- Write down the API before coding: props (name, type, default), events, slots, CSS parts.

## 2. Scaffold

```bash
pnpm nx g @lds/generators:component <name> --description="<one sentence on what it is for>"
```

This creates `packages/web-components/src/components/lds-<name>/` with the component, CSS, stories and a visual test.

## 3. Implement

- Follow `packages/web-components/src/components/lds-button/` as the reference.
- Follow `.github/instructions/components.instructions.md`.
- Use semantic HTML inside the shadow root (`button`, `a`, `ul`, headings via a `heading-level` prop, etc.).
- Keyboard: every interactive part reachable with Tab, operable with Enter/Space, visible `:focus-visible`.

## 4. Stories and tests

- One story per meaningful state (variants, sizes, disabled, long text, empty slot).
- `play()` for behaviour; a `BothBrands` story if the brands differ visibly.
- Extend `<tag>.visual.test.ts` so every variant is in the screenshot for both brands.

## 5. Verify (required)

```bash
pnpm nx build web-components
pnpm nx run-many -t lint stylelint typecheck test
```

The first visual test run creates screenshot references and fails once; run it again. Report anything you
could not make pass instead of disabling a rule or test.

## 6. Hand-off

- Add a version plan: `pnpm nx release plan minor` with a one-line user-facing note.
- In the PR description list the API (props/events/slots/parts) and attach Storybook screenshots for both brands.
