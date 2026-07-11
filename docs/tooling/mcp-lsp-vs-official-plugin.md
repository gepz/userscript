# TypeScript code-intelligence for Claude Code: MCP LSP server vs. the official LSP plugin

_Evaluation note, 2026-07. Question behind it: there's an official Anthropic TypeScript
LSP plugin **and** community MCP-based LSP servers — why do both exist, and is the
official one a vendor-lock-in play?_

## The one fact that answers most of the question

**Both approaches wrap the exact same open-source engine: `typescript-language-server`**
(which is itself a thin LSP wrapper around TypeScript's own `tsserver`). Neither the
official plugin nor any MCP server ships proprietary TypeScript intelligence. They are
both *glue* around a community binary you install yourself:

```
npm install -g typescript-language-server typescript
```

Keep that in mind through everything below — it's why the lock-in worry mostly
evaporates.

## The two shapes

### 1. Official Claude Code LSP plugin (`anthropics/claude-plugins-official`)

- A plugin declares a language server through the **`lspServers`** field in its
  `marketplace.json`, with `extensionToLanguage` mappings (`.ts .tsx .js .jsx .mts .cts
  .mjs .cjs`) and the command line to launch the server.
- It registers with Claude Code's **built-in "LSP tool system"** — a native integration
  that already understands ~12 languages. Claude gets first-class tools: **definition,
  references, diagnostics, rename, hover**.
- The tightest ergonomic win is lifecycle behavior the harness drives — e.g. **automatic
  diagnostics after every edit**: if an edit introduces a type error or missing import,
  the model sees it and fixes it in the same turn, rather than waiting for a manual
  `tsc` run.
- Scope: **Claude Code only.** The plugin manifest format is Anthropic's.

### 2. MCP LSP server (e.g. `isaacphi/mcp-language-server`, `mizchi/typescript-mcp`, `jonrad/lsp-mcp`, `Tritlo/lsp-mcp`)

- A **separate process** that launches a language server over stdio and re-exposes its
  capabilities as **MCP tools** (`definition`, `references`, `diagnostics`, `hover`,
  `rename_symbol`, `edit_file`).
- Configured like any MCP server: install the bridge (`isaacphi`'s is a Go binary via
  `go install`), install the underlying language server, and point your client's MCP
  config at both, per workspace.
- Scope: **any MCP-capable client** — Claude Code, Claude Desktop, Cursor, Cline, etc.
  One conceptual setup travels across tools.
- Cost: an extra abstraction layer (LSP → MCP → client) and more configuration than a
  one-line plugin install. Most are self-described **beta**.

## Why does the official plugin exist? Is it lock-in?

Short answer: **it exists for a better in-product experience, and it is not a meaningful
lock-in of your code intelligence.**

Unpacking that:

- **It's not a moat on the intelligence.** A lock-in play would be Anthropic shipping a
  *proprietary* TypeScript analyzer available only inside Claude. They did the opposite —
  the plugin wraps the community `typescript-language-server`. Your type analysis is the
  same engine you'd get in VS Code or via any MCP bridge. Nothing about your code's
  semantics is captured behind Anthropic's product.
- **The native path is genuinely better *inside Claude Code*, for real reasons, not
  gatekeeping:**
  1. It targets a **purpose-built LSP tool surface** rather than the generic MCP tool
     list, so the tools are ergonomic and the harness can add behaviors MCP can't
     coordinate as cleanly (the auto-diagnostics-after-edit loop).
  2. **Far less setup friction** — one plugin install vs. standing up a separate MCP
     server process, its language server, and per-client wiring.
  3. **Lifecycle/performance managed by the harness** (server startup, workspace roots,
     shutdown) instead of a bridge process you babysit.
- **The lock-in that *does* exist is format-level and mild.** The `marketplace.json` /
  `lspServers` manifest is Claude-Code-specific, so an *official plugin* only runs in
  Claude Code. But because it wraps an open binary, your **switching cost is low**: point
  an MCP LSP server at the same `typescript-language-server` and you have equivalent
  navigation in any other agent. You're locked into a *manifest format*, not into the
  capability.

So the honest framing: this is a normal **first-party integration** — a platform making
its own thin adapter to a first-class experience — not a proprietary capability grab. MCP
exists as the **portable, cross-vendor** path for exactly the people the native plugin
doesn't serve (multi-client users, unusual languages, self-hosters).

## How well-maintained is each? (the naive metric misleads)

"Commits to the plugin" is the wrong health metric, because **the official plugin is not
code.** The `plugins/typescript-lsp/` directory is just `README.md` (692 B) + `LICENSE`;
the actual wiring (`lspServers`, `extensionToLanguage`, the launch command) is one entry
in the repo-root `marketplace.json`. It has **3 commits ever** (last 2026-02) — that's not
neglect, it's a config file that was correct after two edits and hasn't needed touching.

What actually needs maintaining sits *underneath* both approaches (data as of 2026-07):

- **`typescript-language-server`** — the engine the plugin *and* every MCP bridge wrap:
  **~48 commits / 90 days, ~136 / year, v5.3.0 (2026-05), last commit 2026-06.** Genuinely,
  actively maintained. This is the part doing the real TypeScript work.
- **Claude Code's LSP tool system** — the native harness integration the manifest plugs
  into. Anthropic-maintained, and where the plugin *registration* bugs (#16291 etc.) get
  fixed.
- **The MCP bridges** — substantial standalone LSP↔MCP translation code that must keep
  being maintained to keep working: `isaacphi/mcp-language-server` main-branch last commit
  **2025-06 (~13 months quiet)**; `mizchi/typescript-mcp` a burst of ~175 commits then
  **nothing in 180 days** (quiet since ~2025-08).

Counter-intuitive conclusion: **the MCP bridges carry _more_ bit-rot risk, not less.** The
official plugin is trivial glue riding two actively-maintained layers (the harness LSP
system + `typescript-language-server`); the bridges are now-dormant middleware sitting
between your client and that same engine. "Official vs MCP, which is better maintained" is
partly a category error — you're comparing a *manifest* against a *codebase*. The
manifest's risk is "young harness feature, has bugs, actively fixed"; the bridge's risk is
"unmaintained code." Both ultimately ride `typescript-language-server`, which is the
genuinely-maintained piece.

## Which to choose

| Situation | Pick |
|---|---|
| You work in Claude Code on a TS repo and want the least setup + the tightest edit→diagnostics loop | **Official plugin** |
| You use several AI clients and want one code-intelligence setup across all of them | **MCP LSP server** |
| You need a language the official marketplace doesn't cover, or want full control of the bridge | **MCP LSP server** |
| You want zero new infra and already run strict `tsc` + eslint | Neither is *required* — see below |

**Caveat as of mid-2026:** the official TypeScript LSP plugin has open registration/
distribution bugs (claude-code issues #16291, #15235, #14803 — "No LSP server available",
missing `plugin.json` in the marketplace copy). Some users install it from a **local
marketplace** as a workaround. Verify it actually registers before relying on it.

## For this repo specifically

Correctness is already covered: the repo's whole-program `tsc` type gate (see
`docs/architecture.md`, "Build pipeline") is ground truth, and `grep` finds strings. An LSP would be an **accuracy
and speed** upgrade for *symbol-level* work — `grep` can't tell a symbol from a
same-named string and misses references; an LSP gives exact, complete find-references and
safe cross-file rename. The two places it would pay off are already on the backlog: the
**enum → const-object refactor** for native type-stripping, and untangling the **~3.2k-line
filter-expression editor WIP**. Either approach wraps `typescript-language-server`, which
handles our `.mts`/`.cts`/`.tsx` files. Recommendation: if adding one, use the **official
plugin** here (single client, least overhead); reach for an MCP LSP server only if the
tooling later spans multiple agents.

## Sources

- [TypeScript LSP – Claude Plugin (claude.com)](https://claude.com/plugins/typescript-lsp)
- [anthropics/claude-plugins-official — typescript-lsp](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/typescript-lsp)
- [Language Server Plugins architecture (DeepWiki)](https://deepwiki.com/anthropics/claude-plugins-official/7.3-language-server-plugins)
- [isaacphi/mcp-language-server](https://github.com/isaacphi/mcp-language-server)
- [mizchi/typescript-mcp](https://mcpservers.org/servers/mizchi/typescript-mcp)
- [jonrad/lsp-mcp](https://github.com/jonrad/lsp-mcp) · [Tritlo/lsp-mcp](https://github.com/tritlo/lsp-mcp)
- [Claude Code: Stop Grepping, Turn On LSP Semantics (amazingcto.com)](https://www.amazingcto.com/lsp-in-claude/)
- Registration bugs: claude-code [#16291](https://github.com/anthropics/claude-code/issues/16291), [#15235](https://github.com/anthropics/claude-code/issues/15235), [#14803](https://github.com/anthropics/claude-code/issues/14803)
- [Using Claude Code LSP without the official marketplace (classmethod)](https://dev.classmethod.jp/en/articles/claude-code-lsp-from-local-marketplace/)
