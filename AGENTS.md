# LDS (Living Design System) — instructions for AI agents and new contributors

Read this file before changing anything. It is the single source of truth for how this repo works.

## What this repo is

The Toyota/Lexus design system. One set of components serves toyota.com (AEM, server-rendered HTL),
lexus.com (AEM SPA Editor, React) and Angular/React apps. Packages are published to JFrog.

| Package                                 | Path                      | What it is                                                               |
| --------------------------------------- | ------------------------- | ------------------------------------------------------------------------ |
| `@tmna-cx-design-system/tokens`         | `packages/tokens`         | DTCG token JSON → CSS variables / JS / JSON per brand (Style Dictionary) |
| `@tmna-cx-design-system/foundation`     | `packages/foundation`     | Page-level base CSS (reset, typography, focus)                           |
| `@tmna-cx-design-system/web-components` | `packages/web-components` | **The components.** Stencil, shadow DOM. Single source of truth.         |
| `@tmna-cx-design-system/react`          | `packages/react`          | Generated React wrappers. Never hand-written.                            |
| `@tmna-cx-design-system/angular`        | `packages/angular`        | Generated Angular standalone wrappers. Never hand-written.               |
| `@lds/storybook`                        | `apps/storybook`          | Docs + story tests (a11y gated). Brand switch in the toolbar.            |
| `@lds/generators`                       | `tools/generators`        | `nx g @lds/generators:component <name>`                                  |

## Hard rules (CI enforces all of these)

1. **Components are written once, in `packages/web-components`.** Never add a component to the React or Angular packages; their `src/generated/` folders are rebuilt on every build.
2. **Never edit generated files:** `*/src/generated/**`, `packages/web-components/src/components.d.ts`, component `readme.md` below "Auto Generated Below", anything in `dist/`, `loader/`, `components/`.
3. **CSS uses tokens only.** Colours, spacing, radius, font family/size/weight must be `var(--lds-...)`. No hex, rgb(), named colours or raw px for those properties. Stylelint fails otherwise.
4. **Token names are semantic and identical in every brand.** Add a token to `packages/tokens/src/brands/toyota.tokens.json` AND `lexus.tokens.json`. Components must never reference `palette.*` primitives.
5. **Layers only import downward:** tokens ← foundation ← core components ← organisms; wrappers import only web components. `@nx/enforce-module-boundaries` fails otherwise.
6. **Every component ships with:** JSDoc on the class and every `@Prop`/`@Event`/slot/part, a `*.stories.ts` with a `play()` test, and a `*.visual.test.ts`. Accessibility violations fail tests.
7. **Public API changes are deliberate.** Removing or renaming a prop, event, slot, part or token is a breaking change: create a major version plan (`pnpm nx release plan major`) and explain the migration.

## Commands (always through Nx, prefixed with pnpm)

```bash
pnpm install                                   # never npm or yarn
pnpm nx g @lds/generators:component <name>     # new component (name without lds- prefix)
pnpm nx build web-components                   # also regenerates React/Angular wrappers
pnpm nx storybook storybook                    # http://localhost:6006
pnpm nx run-many -t lint stylelint typecheck test
pnpm nx affected -t lint stylelint typecheck test build   # what CI runs
pnpm nx test web-components -- -u              # accept intended visual changes
pnpm nx release plan <patch|minor|major>       # record a change for the next release
```

## Definition of done for a component change

- [ ] Built with the generator (new components) and follows `lds-button` as the reference implementation
- [ ] Works in both brands (check the Storybook toolbar), keyboard accessible, visible focus
- [ ] `pnpm nx affected -t lint stylelint typecheck test build` passes locally
- [ ] Screenshot references updated only for intended visual changes
- [ ] Version plan added if the change should be released

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
