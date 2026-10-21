---
applyTo: 'packages/web-components/src/components/**'
---

# Writing LDS web components (Stencil)

- `lds-button` is the reference implementation. Match its structure.
- `shadow: true` (or `{ delegatesFocus: true }` for interactive controls). One root element with `part="..."`.
- Every `@Prop`, `@Event`, `@slot` and `@part` has a JSDoc comment. Write HTML tags in backticks (`` `<button>` ``),
  otherwise Storybook renders them as real elements.
- Props are primitives or string unions; reflect visual props (`@Prop({ reflect: true })`).
- Custom events are named `lds<Thing>` (e.g. `ldsChange`) and are `composed: true` so they cross shadow DOM.
- Native form controls inside shadow DOM need `formAssociated: true` + `@AttachInternals()`.
- Styles live in the component's Panda recipe (`packages/styles/src/recipes/<name>.ts`), not in its `.css`.
  The `.css` file only `@import`s the recipe CSS (`~@tmna-cx-design-system/styles/dist/css/styles/recipes/<name>.css`)
  and sets `:host` layout. Class names come from the recipe function: `class={button({ variant: this.variant })}`.
- Prop unions must equal the recipe's variants; keep the generator's `Same<...>` compile-time check.
- Select inner elements in tests by `part` (`[part="control"]`), not by class: classes belong to the recipe.
- Images from AEM: accept `src`/`srcset`/`sizes`/`alt` props or a slotted `<picture>`; never hard-code renditions.
- Never edit `src/components.d.ts` or `readme.md` below "Auto Generated Below"; the build regenerates them.
