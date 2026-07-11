# SonarQube Community (and lighter alternatives) for a TypeScript monorepo

_Evaluation note, 2026-07. Question behind it: should this repo adopt SonarSource
Community Edition (now "SonarQube Community Build") or something similar?_

## TL;DR

For an 8-package solo TS monorepo that already runs eslint (airbnb-extended +
typescript-eslint) and strict `tsc`, **self-hosted SonarQube Community Build is not worth
the operational cost** — its rule set overlaps heavily with what's already enforced, and
its most useful differentiators are team/scale features. If you want Sonar's *rules*, add
**`eslint-plugin-sonarjs`** to the existing lint step (no server). If you want the
*dashboard/quality-gate* experience, **SonarCloud** is lower-overhead than self-hosting.

## What SonarQube Community Build is

A **self-hosted static-analysis server**: you run it (Docker + a database) and push
analysis from a `sonar-scanner` run, then browse findings, quality gates, and trends in a
web UI. It covers **20+ languages on a single branch**, JS/TS/CSS included, up to
**ECMAScript 2024** and **TypeScript 5.9.3**.

### What's in Community vs. what's gated

| Capability | Community Build | Notes |
|---|---|---|
| JS/TS/CSS analysis | Yes | Core rules, single project |
| **Branch analysis** | No | Multi-branch is Developer edition+ |
| **PR decoration** | No | Also Developer+; makes CE a poor fit for PR-review workflows |
| Advanced security (taint/injection dataflow) | Mostly no | Deep security analysis is a paid tier for JS/TS |
| Quality-gate dashboard + history | Yes | The main genuine draw |
| Cognitive-complexity metric | Yes | Not native to eslint |
| Cross-file duplication detection | Yes | Not native to eslint |

There's an unofficial `sonarqube-community-branch-plugin` (mc1arke) that bolts
branch/PR analysis onto CE, but it's a community hack against internal APIs — not
something to depend on. Independent 2026 reviews land CE as **"best for personal projects,
evaluation, and learning"** precisely because of the no-branch/no-PR limitation.

## How much of it is actually new here

The repo's existing gate is already strong: **eslint 9 flat config** (airbnb-extended,
typescript-eslint, `eslint-plugin-canonical`, import plugins) plus the repo's
**whole-program `tsc` type gate** (see `docs/architecture.md`, "Build pipeline"). A large
share of Sonar's TS "code smell" / bug-pattern rules overlap with what airbnb + typescript-eslint
already flag. Sonar even documents that it **imports a selection of ESLint rules** and
**respects your eslint disable comments** — a tell of how much common ground there is.

The genuinely *additive* pieces are three, and all are "nice for a team watching drift,"
not gaps hurting the repo today:
1. **Cognitive complexity** gating.
2. **Cross-file duplication** metrics.
3. **Historical quality-gate dashboard** (trend over time).

## The cost side

- **Infrastructure:** a server + database to run and maintain (Docker), versus
  `npx eslint .` which returns structured findings instantly.
- **Out-of-band from the edit loop:** a `sonar-scanner` run produces a report you read
  in a UI later; it doesn't sit in the fast local feedback loop the way eslint/tsc do.
- **No agent leverage:** SonarQube is not an MCP and exposes no interactive capability —
  unlike an LSP, it doesn't expand what an AI agent can *do*; it's a second opinion that
  mostly echoes eslint.

## The lighter alternatives (recommended)

### `eslint-plugin-sonarjs` — Sonar's rules, no server

SonarSource publishes its **JavaScript/TypeScript rules as an ESLint plugin**. It runs
inside the lint step you already have, needs **no server**, and brings the bug-detection
and **cognitive-complexity** rules that are Sonar's real value-add for a codebase this
size. Recent majors support **ESLint 9 flat config**, so it drops into the existing
`@userscript/eslint-config` factory. This captures most of Sonar's TS value at
near-zero operational cost and keeps everything in one pipeline (one source of truth,
one place to silence a rule) — consistent with this repo's "explain/gate a mechanism
once" leaning.

### SonarCloud — dashboards without hosting

If the actual want is the **quality-gate dashboard and history** (not just the rules),
SonarSource's hosted **SonarCloud** gives that without running a server. Free for public
repos; check current terms for private ones. Lower-overhead than self-hosting CE, and it
*does* do PR decoration (unlike self-hosted Community).

## Recommendation

1. **Don't stand up self-hosted Community Build** for this repo — overhead exceeds the
   marginal value, the rules largely duplicate the existing eslint+tsc gate, and CE's
   no-PR-analysis makes it a weak fit for a review workflow.
2. **If you want Sonar's rules:** add **`eslint-plugin-sonarjs`** to
   `@userscript/eslint-config`. Lightest path, biggest overlap with the real value.
3. **If you want the dashboard/trends for their own sake:** use **SonarCloud**, not
   self-hosted CE.
4. **Revisit full SonarQube** only if the codebase/team grows enough that quality-gate
   history and duplication dashboards start paying for the infrastructure — not at the
   current size.

For catching bugs in review, note the repo already has the `/code-review` and
`/security-review` skills plus eslint — that "extra pair of eyes" niche is largely
covered without adding a server.

## Sources

- [JavaScript/TypeScript/CSS — SonarQube Community Build (Sonar docs)](https://docs.sonarsource.com/sonarqube-community-build/analyzing-source-code/languages/javascript-typescript-css)
- [JavaScript/TypeScript/CSS — SonarQube Server (Sonar docs)](https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/languages/javascript-typescript-css)
- [SonarQube Review 2026: Pricing, Tiers & Pros/Cons (appsecsanta)](https://appsecsanta.com/sonarqube)
- [SonarQube Review 2026 (techsy)](https://techsy.io/en/blog/sonarqube-review)
- [mc1arke/sonarqube-community-branch-plugin](https://github.com/mc1arke/sonarqube-community-branch-plugin)
- [SonarQube product page](https://www.sonarsource.com/products/sonarqube/)
- `eslint-plugin-sonarjs` on npm (SonarSource-maintained) · SonarCloud at sonarcloud.io
