---
name: lds-review
description: Review the current changes against the LDS design-system rules. Reports findings; changes nothing.
argument-hint: optional - a file, folder or PR to focus on
agent: ask
---

Review my current changes (or the file, folder or PR I name) against the LDS rules. Do not edit
anything.

Use the checklist in `.github/agents/lds-reviewer.agent.md` ([open](../agents/lds-reviewer.agent.md))
and the hard rules in `AGENTS.md` ([open](../../AGENTS.md)). Group findings as blocker, should fix or
nit, each with the file, the line and a one-line fix. Say so when you find nothing.
