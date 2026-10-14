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
- Styles: only `var(--lds-*)` tokens; BEM classes (`block`, `block__element`, `block--modifier`).
- Images from AEM: accept `src`/`srcset`/`sizes`/`alt` props or a slotted `<picture>`; never hard-code renditions.
- Never edit `src/components.d.ts` or `readme.md` below "Auto Generated Below"; the build regenerates them.
