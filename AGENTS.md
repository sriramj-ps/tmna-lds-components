# LDS (Living Design System) — instructions for AI agents and new contributors

Read this file before changing anything. It is the single source of truth for how this repo works.

## What this repo is

The Toyota/Lexus design system's components. One set of components serves toyota.com (AEM,
server-rendered HTL), lexus.com (AEM SPA Editor, React) and Angular/React apps. Packages are published
to JFrog.

**Tokens are not defined here.** They come from the styling repo (lxc-lds-style) as the Panda CSS preset
`@tmna/panda-preset-base`. This repo turns that preset into LDS recipes (the look of each component) and
ships them three ways: web components (HTML/AEM), React wrappers and Angular wrappers.

| Package                                 | Path                      | What it is                                                                        |
| --------------------------------------- | ------------------------- | --------------------------------------------------------------------------------- |
| `@tmna-cx-design-system/styles`         | `packages/styles`         | Panda CSS: TMNA preset + LDS recipes → `tokens.css`, `styles.css`, recipe classes |
| `@tmna-cx-design-system/web-components` | `packages/web-components` | **The components.** Stencil, shadow DOM, styled by the recipes. Source of truth.  |
| `@tmna-cx-design-system/react`          | `packages/react`          | Generated React wrappers. Never hand-written.                                     |
| `@tmna-cx-design-system/angular`        | `packages/angular`        | Generated Angular standalone wrappers. Never hand-written.                        |
| `@lds/storybook`                        | `apps/storybook`          | Docs + story tests (a11y gated)                                                   |
| `@lds/html-example`                     | `apps/html-example`       | Plain HTML page: `register` import + the CSS-only recipe classes                  |
| `@lds/react-example`                    | `apps/react-example`      | React 19 app: generated wrappers + the elements with the shipped JSX types        |
| `@lds/angular-example`                  | `apps/angular-example`    | Angular app: generated standalone wrappers                                        |
| `@lds/generators`                       | `tools/generators`        | `nx g @lds/generators:component <name>` (creates the component AND its recipe)    |
| `@lds/smoke-test`                       | `tools/smoke-test`        | `lds-smoke`: opens an example's production build in Chromium and checks LDS works |

Consumer docs (Storybook "Guides" pages, published by `.github/workflows/docs.yml`) live in
`apps/storybook/docs/`. Shared prompts for Copilot and Slingshot live in `.github/prompts/`.

`vendor/` holds the TMNA preset as a tarball until the styling repo publishes it to JFrog.

## How styling works

1. `packages/styles/panda.config.ts` loads Panda's base preset + `@tmna/panda-preset-base` (tokens) and
   every recipe in `packages/styles/src/recipes/`. Prefix `lds`: variables are `--lds-*`, classes `.lds-*`.
2. `nx build styles` runs `panda codegen` (typed `recipes` functions in `styled-system/`), `panda cssgen`
   (`dist/styles.css`, `dist/css/styles/tokens.css`, one CSS file per recipe) and `panda lib --spec`.
3. A component imports its recipe's CSS into its shadow root (`@import '~@tmna-cx-design-system/styles/dist/css/styles/recipes/<name>.css'`)
   and gets its class names from the recipe function: `button({ variant, size })`.
4. Token variables are inherited from the page, which loads `@tmna-cx-design-system/styles/tokens.css`
   once (or `styles.css`, which also has every recipe class for HTML-only markup).

## Hard rules (CI enforces all of these)

1. **Components are written once, in `packages/web-components`.** Never add a component to the React or Angular packages; their `src/generated/` folders are rebuilt on every build.
2. **Never edit generated files:** `*/src/generated/**`, `packages/web-components/src/components.d.ts`, component `readme.md` below "Auto Generated Below", anything in `dist/`, `loader/`, `components/`, `packages/styles/styled-system/`.
3. **A component's look lives in its Panda recipe**, `packages/styles/src/recipes/<name>.ts`, written with `defineRecipe` from `../define-recipe`. Values must be tokens (`paddingInline: '4'`, `color: 'black'`); a raw value like `'13px'` fails `nx typecheck styles` (`strictTokens`). Use long property names (`backgroundColor`, not `bg`). The component's `.css` only imports the recipe CSS and sets `:host` layout; any other CSS uses `var(--lds-...)` only (Stylelint fails otherwise).
4. **Never create tokens in this repo.** Missing a colour, size or font? Ask for it in the styling repo (lxc-lds-style), then bump `@tmna/panda-preset-base`. `@pandacss/dev` must stay on exactly the version the preset's peer dependency names.
5. **Layers only import downward:** styles ← core components ← organisms; wrappers import only web components. `@nx/enforce-module-boundaries` fails otherwise.
6. **Every component ships with:** its recipe, JSDoc on the class and every `@Prop`/`@Event`/slot/part, a `*.stories.ts` with a `play()` test, and a `*.visual.test.ts`. Prop unions must match the recipe variants (the generator adds a compile-time check). Accessibility violations fail tests.
7. **Consumers are tested like consumers.** Each example app's `test` target builds it for production and runs `lds-smoke` on it. A change to how apps install or load LDS (exports, `register`, `jsx` types, CSS files) must keep all three examples passing and update the Storybook guides.
8. **Public API changes are deliberate.** Removing or renaming a prop, event, slot, part, recipe or recipe variant (HTML-only pages use the class names `lds-<recipe>--<variant>_<value>`) is a breaking change: create a major version plan (`pnpm nx release plan major`) and explain the migration.

Brands: Toyota/Lexus switching arrives when the styling repo ships Panda themes (`data-panda-theme`). Until then, no brand-specific CSS in components.

## Commands (always through Nx, prefixed with pnpm)

```bash
pnpm install                                   # never npm or yarn
pnpm nx g @lds/generators:component <name>     # new component + recipe (name without lds- prefix)
pnpm nx build web-components                   # builds styles first; also regenerates React/Angular wrappers
pnpm nx storybook storybook                    # http://localhost:6006
pnpm nx serve html-example                     # http://localhost:4300, plain HTML consumer
pnpm nx serve react-example                    # http://localhost:4301
pnpm nx serve angular-example                  # http://localhost:4302 (Node 24, see .nvmrc)
pnpm pack:local                                # tarballs in dist/local-packs/ to try LDS in another app
pnpm nx run-many -t lint stylelint typecheck test
pnpm nx affected -t lint stylelint typecheck test build   # what CI runs
pnpm nx test web-components -- -u              # accept intended visual changes
pnpm nx release plan <patch|minor|major>       # record a change for the next release
```

## Definition of done for a component change

- [ ] Built with the generator (new components) and follows `lds-button` as the reference implementation
- [ ] Styles only in the recipe, tokens only; keyboard accessible, visible focus
- [ ] `pnpm nx affected -t lint stylelint typecheck test build` passes locally
- [ ] Screenshot references updated only for intended visual changes
- [ ] Storybook guides (`apps/storybook/docs/`) updated if consumers need to do anything differently
- [ ] Version plan added if the change should be released

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
