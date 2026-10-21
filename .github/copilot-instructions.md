# Copilot instructions

Follow `AGENTS.md` at the repo root. It defines the packages, the hard rules CI enforces, the
commands to run, and the definition of done. Path-specific rules live in `.github/instructions/`.

Short version:

- Components live only in `packages/web-components` (Stencil, shadow DOM). React/Angular wrappers are generated.
- A component's look is a Panda recipe in `packages/styles/src/recipes/`, tokens only. Tokens come from the
  styling repo (`@tmna/panda-preset-base`); never define new ones here. Any hand-written CSS uses `var(--lds-*)`.
- Never edit generated files (`src/generated/`, `components.d.ts`, `dist/`, `styled-system/`).
- Use `pnpm nx ...` for every task. Create components with `pnpm nx g @lds/generators:component <name>`.
- Run `pnpm nx affected -t lint stylelint typecheck test build` before saying a task is finished.
