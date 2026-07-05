# Agent Conventions

Defaults for coding agents working in this repo. Project-specific rules elsewhere in
this file (or in nested `AGENTS.md` files) win on any conflict.

## Coding conventions

- **Don't name a class `XxxService`** unless explicitly instructed to. Reach for a name
  that says what the type *is* or *does*.
- **No emojis in comments.**
- **Comment the non-obvious.** Spend comments on unexpected usage constraints, side
  effects, and the *why* behind a decision — not on restating what the code already says.
- **Comments describe the present, not the past.** Don't leave historical notes
  (`Modified X`, `Fixed Y`, `was previously …`) in existing comments — either delete them
  or rewrite them to describe the code's current intent, behaviour, or constraints.
  Revision history belongs to version control.
- **Comments are testimony, not ground truth.** Before repeating or building on a
  comment's claim about how something works — especially one describing a mechanism
  defined far from where the comment sits — verify it against the code (and any
  authoritative docs). If they disagree, the code is the description of current
  behavior: fix the comment in the same change — unless the comment reads like lost
  intent rather than a stale description, in which case surface the discrepancy
  instead of silently rewriting it.
- **Fix bugs at the root, not around them.** Avoid speculative workarounds or defensive
  coding that adds technical debt. Add logs, prints, or tests to probe the environment
  and confirm the exact cause and conditions first, then make a precise fix. Remove any
  temporary logs or debug prints once the issue is resolved.
- **Prefer modern, modular patterns** over legacy or monolithic ones.

## Agent-doc filename convention

`AGENTS.md` is the canonical file; `CLAUDE.md` is a symlink to it, so either filename a
tool loads resolves to the same text with nothing to keep in sync.

```sh
ln -s AGENTS.md CLAUDE.md
```
