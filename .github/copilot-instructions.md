# Copilot instructions

Follow `AGENTS.md` at the repo root. It defines the packages, the hard rules CI enforces, the
commands to run, and the definition of done. Path-specific rules live in `.github/instructions/`.

Short version:

- Components live only in `packages/web-components` (Stencil, shadow DOM). React/Angular wrappers are generated.
- CSS uses `var(--lds-*)` tokens only. Never raw colours or sizes.
- Never edit generated files (`src/generated/`, `components.d.ts`, `dist/`).
- Use `pnpm nx ...` for every task. Create components with `pnpm nx g @lds/generators:component <name>`.
- Run `pnpm nx affected -t lint stylelint typecheck test build` before saying a task is finished.
