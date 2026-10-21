# LDS in plain HTML

A plain HTML page using LDS the two ways a non-framework site can. It mirrors the styling repo's
`sandbox/app-consuming-ds-html` example, plus the web components.

```bash
pnpm nx serve html-example     # http://localhost:4300 (builds styles + web components first)
pnpm nx build html-example     # static site in apps/html-example/dist
```

## What the page shows

| Section                  | Needs                                      | Use it for                                                       |
| ------------------------ | ------------------------------------------ | ---------------------------------------------------------------- |
| `<lds-button>`           | `styles/tokens.css` + the component script | Everything you can. Look **and** behaviour (focus, forms, links) |
| `class="lds-button ..."` | `styles/styles.css`                        | Markup you can't change into a web component. No JS needed       |

Recipe class names follow Panda's pattern: `lds-<recipe>` plus `lds-<recipe>--<variant>_<value>`,
e.g. `lds-button lds-button--variant_secondary lds-button--size_lg`.

## Without a bundler (AEM HTL pages)

AEM pages don't run Vite. Serve the two packages' files from a clientlib (or the JFrog/CDN copy)
and add two tags to the page template:

```html
<!-- Tokens (+ recipe classes, if the page uses them) -->
<link rel="stylesheet" href="/etc.clientlibs/lds/styles/styles.css" />
<!-- Lazy loader: registers every lds-* tag and downloads a component only when it appears -->
<script type="module" src="/etc.clientlibs/lds/web-components/lds/lds.esm.js"></script>
```

| File in the clientlib               | Copied from                                                      |
| ----------------------------------- | ---------------------------------------------------------------- |
| `styles/styles.css`                 | `@tmna-cx-design-system/styles/dist/styles.css`                  |
| `styles/tokens.css` (if no classes) | `@tmna-cx-design-system/styles/dist/css/styles/tokens.css`       |
| `web-components/lds/*`              | `@tmna-cx-design-system/web-components/dist/lds/` (whole folder) |
