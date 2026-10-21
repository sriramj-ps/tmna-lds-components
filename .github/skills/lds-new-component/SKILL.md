---
name: lds-new-component
description: Build a new LDS web component (optionally from a Figma node) end to end - generator, Panda recipe with tokens, implementation, stories, visual test, and all quality gates. USE WHEN asked to create, scaffold or implement a component, atom, molecule or organism, or to turn a Figma design into a component.
---

# Build a new LDS component

Follow these steps in order. Do not skip the verification step.

## 1. Understand the design

- If a Figma link is given and the Figma MCP server is available, call `get_design_context` for the node
  and `get_variable_defs` to see which Figma variables it uses. Treat the returned code as a reference only.
- Map every colour, spacing, radius and type value to an existing token of the TMNA preset. The full list is
  in `packages/styles/dist/css/styles/tokens.css` after `pnpm nx build styles` (`--lds-spacing-4` → `'4'`).
- If a value has no token, STOP and ask: tokens are added in the styling repo (lxc-lds-style), never here.
  Never hard-code the value.
- Write down the API before coding: props (name, type, default), events, slots, CSS parts.

## 2. Scaffold

```bash
pnpm nx g @lds/generators:component <name> --description="<one sentence on what it is for>"
```

This creates `packages/web-components/src/components/lds-<name>/` (component, CSS, stories, visual test) and
`packages/styles/src/recipes/<name>.ts` (the Panda recipe), and registers the recipe in `recipes/index.ts`.

## 3. Implement

- Follow `packages/web-components/src/components/lds-button/` as the reference.
- Follow `.github/instructions/components.instructions.md` and `.github/instructions/styles.instructions.md`.
- Put every visual rule in the recipe (`base`, `variants`, `compoundVariants`), never in the component's `.css`.
  Add a variant to the recipe and the prop union together; the `Same<...>` check fails the build otherwise.
- Use semantic HTML inside the shadow root (`button`, `a`, `ul`, headings via a `heading-level` prop, etc.).
- Keyboard: every interactive part reachable with Tab, operable with Enter/Space, visible `:focus-visible`.

## 4. Stories and tests

- One story per meaningful state (variants, sizes, disabled, long text, empty slot).
- `play()` for behaviour.
- Extend `<tag>.visual.test.ts` so every variant is in the screenshot.

## 5. Verify (required)

```bash
pnpm nx build web-components                        # builds styles first
pnpm nx run-many -t lint stylelint typecheck test
```

The first visual test run creates screenshot references and fails once; run it again. Report anything you
could not make pass instead of disabling a rule or test.

## 6. Hand-off

- Add a version plan: `pnpm nx release plan minor` with a one-line user-facing note.
- In the PR description list the API (props/events/slots/parts) and attach Storybook screenshots.
