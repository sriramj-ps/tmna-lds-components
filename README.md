# LDS (Living Design System)

Toyota and Lexus design-system components. Each component is written once as a Stencil web component.
React and Angular wrappers are generated from it, and everything is published to JFrog.

| Package                                 | What it is                                                               |
| --------------------------------------- | ------------------------------------------------------------------------ |
| `@tmna-cx-design-system/tokens`         | Design tokens (Toyota + Lexus brand modes) as CSS variables, JS and JSON |
| `@tmna-cx-design-system/foundation`     | Page-level base CSS: reset, typography, focus                            |
| `@tmna-cx-design-system/web-components` | The components (`<lds-button>` ...). Works in AEM HTL, React and Angular |
| `@tmna-cx-design-system/react`          | Generated React wrappers                                                 |
| `@tmna-cx-design-system/angular`        | Generated Angular standalone wrappers                                    |

## Before the first push

1. Replace `YOUR-COMPANY` / `lds-npm` with your JFrog host and repository in `.npmrc` and `.github/workflows/release.yml`.
2. Replace `YOUR-ORG` team names in `.github/CODEOWNERS`.
3. Replace the placeholder token values in `packages/tokens/src/` with the Figma Variables export.

## Getting started

```bash
git init -b main && git add -A && git commit -m "chore: initial LDS workspace"   # only if you started from the zip
fnm use                      # Node 24 (see .nvmrc)
pnpm install                 # also installs the git hooks
pnpm exec playwright install chromium
pnpm nx run-many -t build    # tokens -> foundation -> web components -> React/Angular wrappers
pnpm nx storybook storybook  # http://localhost:6006 (Brand switch in the toolbar)
```

## Everyday commands

```bash
pnpm nx g @lds/generators:component <name>          # new component (no lds- prefix)
pnpm nx affected -t lint stylelint typecheck test build publint
pnpm nx test web-components -- -u                   # accept intended visual changes
pnpm nx release plan <patch|minor|major> -m "..."   # record a change for the next release
pnpm nx graph                                       # see how the packages depend on each other
```

Rules for contributors and AI agents are in [AGENTS.md](./AGENTS.md).
