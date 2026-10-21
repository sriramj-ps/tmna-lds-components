---
name: lds-update-preset
description: Bring a new version of the TMNA Panda preset (lxc-lds-style) into LDS, or handle a request for a token LDS doesn't have.
argument-hint: new preset version, or the token you need
agent: agent
---

Update the TMNA Panda preset (`@tmna/panda-preset-base`) used by LDS, or handle the token request I
describe. If it isn't clear which one I want, ask.

Follow the skill in `.github/skills/lds-update-preset/SKILL.md`
([open](../skills/lds-update-preset/SKILL.md)) and the rules in `AGENTS.md` ([open](../../AGENTS.md)).
Never add tokens or raw values in this repo: a missing token goes to the styling repo first.

Finish with `pnpm nx run-many -t build lint stylelint typecheck test` passing, visual changes
reviewed one by one, and a version plan that matches the change (patch, minor or major).
