---
applyTo: '**/*.stories.ts,**/*.test.ts,**/*.test.tsx'
---

# Stories and tests

- Stories use CSF3 with `lit` `html` templates and `satisfies Meta<Args>`. Title: `Core/<Name>` or `Organisms/<Name>`.
- Each story that has behaviour gets a `play()` using `expect`/`userEvent` from `storybook/test`.
- Accessibility is checked automatically (axe, `a11y.test = 'error'`). Fix violations; only use
  `parameters: { a11y: { test: 'todo' } }` on a single story with a linked ticket.
- Visual tests (`*.visual.test.ts`) render every variant in both brands and call `toMatchScreenshot`.
  Update references only for intended changes: `pnpm nx test web-components -- -u`.
- Wait for rendering with `customElements.whenDefined()` + `expect.poll(() => host.shadowRoot?.querySelector(...))`.
  `componentOnReady()` does not exist in the `components/` build.
