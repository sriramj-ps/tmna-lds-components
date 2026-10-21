---
name: lds-new-component
description: Build a new LDS web component and its Panda recipe end to end, with stories, a visual test and every quality gate passing.
argument-hint: component name in kebab-case without lds- (and a Figma link, if there is one)
agent: agent
---

Build a new LDS component. If I didn't give a component name (kebab-case, without `lds-`), ask for it
before doing anything else. If I gave a Figma link, use it for the design.

Follow the skill in `.github/skills/lds-new-component/SKILL.md`
([open](../skills/lds-new-component/SKILL.md)) step by step, and the rules in `AGENTS.md`
([open](../../AGENTS.md)). In short:

1. Scaffold with `pnpm nx g @lds/generators:component <name> --description="<one sentence>"`.
2. Put every visual rule in the recipe (`packages/styles/src/recipes/<name>.ts`), tokens only. If the
   design needs a value with no token, stop and ask: tokens are added in the styling repo.
3. Implement the component with `lds-button` as the reference, then stories with `play()` tests and
   the visual test.
4. Run `pnpm nx run-many -t lint stylelint typecheck test build` and fix what fails. Report anything
   you could not make pass instead of disabling a rule or a test.
5. Add a version plan: `pnpm nx release plan minor -m "<user-facing note>"`.
