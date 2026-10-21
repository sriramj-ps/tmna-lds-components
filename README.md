# LDS (Living Design System)

Toyota and Lexus design-system components. Each component is written once as a Stencil web component
and styled by a Panda CSS recipe built on the TMNA preset from the styling repo (lxc-lds-style).
React and Angular wrappers are generated from it, and everything is published to JFrog.

| Package                                 | What it is                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------ |
| `@tmna-cx-design-system/styles`         | Tokens (from `@tmna/panda-preset-base`) + LDS recipes, as CSS and typed Panda output |
| `@tmna-cx-design-system/web-components` | The components (`<lds-button>` ...). Works in AEM HTL, plain HTML, React and Angular |
| `@tmna-cx-design-system/react`          | Generated React wrappers                                                             |
| `@tmna-cx-design-system/angular`        | Generated Angular standalone wrappers                                                |

## Using LDS

Every page or app loads the tokens once, then uses the components for its framework.

**HTML / AEM HTL** (see [apps/html-example](./apps/html-example) for a running page):

```html
<link rel="stylesheet" href="…/@tmna-cx-design-system/styles/dist/css/styles/tokens.css" />
<script type="module" src="…/@tmna-cx-design-system/web-components/dist/lds/lds.esm.js"></script>

<lds-button variant="secondary">Learn more</lds-button>
```

Markup that can't be a web component can use the same recipe as classes, with `styles.css`
instead of `tokens.css`: `<button class="lds-button lds-button--variant_primary lds-button--size_md">`.

**React**

```tsx
import '@tmna-cx-design-system/styles/tokens.css';
import { LdsButton } from '@tmna-cx-design-system/react';

<LdsButton variant="secondary" onClick={…}>Learn more</LdsButton>;
```

**Angular**

```ts
// angular.json → "styles": ["node_modules/@tmna-cx-design-system/styles/dist/css/styles/tokens.css"]
import { LdsButton } from '@tmna-cx-design-system/angular';

@Component({ imports: [LdsButton], template: `<lds-button variant="secondary">Learn more</lds-button>` })
```

**React apps that use Panda themselves** can build on LDS directly: `designSystem: '@tmna-cx-design-system/styles'`
in their `panda.config.ts` gives them the same tokens and recipes (`import { button } from 'styled-system/recipes'`).

## Before the first push

1. Replace `YOUR-COMPANY` / `lds-npm` with your JFrog host and repository in `.npmrc` and `.github/workflows/release.yml`.
2. Replace `YOUR-ORG` team names in `.github/CODEOWNERS`.
3. When the styling repo publishes `@tmna/panda-preset-base` to JFrog, replace the `file:../../vendor/…tgz`
   version in `packages/styles/package.json` with the published version and delete `vendor/`.

## Getting started

```bash
git init -b main && git add -A && git commit -m "chore: initial LDS workspace"   # only if you started from the zip
fnm use                      # Node 24 (see .nvmrc)
pnpm install                 # also installs the git hooks
pnpm exec playwright install chromium
pnpm nx run-many -t build    # styles -> web components -> React/Angular wrappers
pnpm nx storybook storybook  # http://localhost:6006
pnpm nx serve html-example   # http://localhost:4300
```

## Everyday commands

```bash
pnpm nx g @lds/generators:component <name>          # new component + its recipe (no lds- prefix)
pnpm nx affected -t lint stylelint typecheck test build publint
pnpm nx test web-components -- -u                   # accept intended visual changes
pnpm nx release plan <patch|minor|major> -m "..."   # record a change for the next release
pnpm nx graph                                       # see how the packages depend on each other
```

Rules for contributors and AI agents are in [AGENTS.md](./AGENTS.md).
