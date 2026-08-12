# Decisions and non-obvious history

Why things that look odd are the way they are. Add an entry whenever a change
encodes reasoning that the code alone can't show; delete entries when they
stop being true.

## hyperapp's typings are pnpm-patched (2026-08; stub era 2026-07)

hyperapp 2.0.22 (the final release of a dormant project) ships typings that
subtract `DocumentAndElementEventHandlers` from `HTMLElement`. TypeScript 5.0
removed that interface from `lib.dom` (its members moved onto
`HTMLElement`/`GlobalEventHandlers`), so any whole-program check fails inside
hyperapp's `index.d.ts`. The fix is `patches/hyperapp@2.0.22.patch`: it drops
the dead interface from the `Props` subtraction, which loses nothing because
`GlobalEventHandlers` — where those members now live — is subtracted right
beside it. Upstream is dormant, so the patch will never conflict with a bump.

Earlier workarounds, both removed. First `ui` replaced the compiler's entire
DOM lib via `"@typescript/lib-dom": "npm:@types/web@^0.0.86"`, freezing its
DOM types at early 2023; then each consuming package carried an empty ambient
`DocumentAndElementEventHandlers` stub (`src/hyperappDomCompat.d.ts`), which
worked but injected a fake global interface into every consumer's whole
program and had to be re-remembered per package. Don't reintroduce either;
the patch fixes the one wrong line at its source. The error stayed invisible
for two years because nothing ran a whole-program check (see the
fork-ts-checker entry).

## fork-ts-checker: checker yes, emitter no (2026-07; first tried 2023-08)

`ForkTsCheckerWebpackPlugin` ran redundantly beside a fully-checking
ts-loader until 2023-08, was then commented out during an experiment with
`typescript: { build: true, mode: 'write-dts' }` (emitting lib declarations
from the webpack build), and the experiment was abandoned: the emitted
declarations need `tsc-alias` to rewrite `@/` aliases, and fork-ts-checker
has no post-emit hook. From then until 2026-07 nothing whole-program-checked
the tree, which let the hyperapp typing break hide.

Current design: ts-loader is `transpileOnly`; fork-ts-checker runs as a pure
checker (no emit) against `tsconfig.build.json`; lib output stays with
`tsc && tsc-alias`. Bundles were verified byte-identical before/after the
`transpileOnly` switch.

## Ambient `@types` are listed, not discovered (2026-07)

TypeScript 5.x, given no `types` array, sweeps every `@types/*` package it
can reach and makes it globally visible. TypeScript 6 defaults the option to
`[]` instead: a package that nothing imports is simply absent, which is
where its 20-50% check-time win comes from. Adopting 6 without this cost
flow-youtube-chat 40 errors and custom-sort 9 — `GM`, `process`, the
`node:*` specifiers, even `stream` inside `astring`'s own declarations — all
from the one change. `"types": ["*"]` restores the old sweep; don't, it
gives back the speed for nothing.

So each GM-using package carries a `tsconfig.types.json` naming what it
actually needs, and every program over its `src/` extends that file. The
per-program repetition is unavoidable: a `types` array *replaces* the one it
inherits rather than merging, so a single declaration high in the `extends`
chain would be silently dropped by any project that sets its own.

`baseUrl` went at the same time. 6 deprecates it (TS5101) and 7 removes it
(TS5102); the `paths` entries anchor themselves with `${configDir}` and
never needed it. Deleting the option is what 6 wants; the escape hatch it
suggests, `ignoreDeprecations: "6.0"`, is deliberately unused here, because
a suppressed deprecation is a removal waiting to land in 7.

6 also forces `esModuleInterop` true, which is inert here: ESM emit never
reaches for the interop helpers — confirmed rather than assumed, by the
bundle comparison below.

Going 5.9.3 to 6.0.3 left the five `lib/` outputs and both userscript
bundles byte-identical (`tsc-alias` reads `baseUrl`, so that was worth
confirming), with the suite and lint clean. Keep that comparison in the
loop for 7: it is a different compiler, not a newer one.

## Editor-reference projects: emitDeclarationOnly, not noEmit (2026-08)

flow-youtube-chat's `tsconfig.src.json` and `tsconfig.spec.json` exist so
editors assign files to the right program (`docs/architecture.md`,
"tsconfig layering"); nothing ever runs their emit. They still declare
`emitDeclarationOnly` rather than the more accurate `noEmit`, because
`tsconfig.json` references them and a referenced project may not disable
emit (TS6310 — tsserver flags it on `tsconfig.json` even though no
build-mode workflow exists here; project references serve only editor
assignment). Verified on 6.0.3: CLI `--noEmit` composes with config
`emitDeclarationOnly`, so `tsc -p tsconfig.spec.json --noEmit` stays the
check command and still emits nothing; `declarationDir` points at the
gitignored `.tsout/` purely so an accidental plain `tsc -p` run lands in
one directory instead of scattering `.d.ts` beside sources. The
structurally sanctioned alternative — a solution-style `tsconfig.json`
with `"files": []`, which skips reference validation — would strand the
`config/` scripts and WIP sources that the everything-view program exists
to cover.

## Per-key config machinery: correlated generics, no `as never` (2026-08)

flow-youtube-chat indexes records by `keyof UserConfig` (setters, dispatch
tables, GM codecs). TypeScript loses the key-value correlation the moment
the two travel separately: a destructured pair becomes two independent
unions, indexing a record of functions with a union key yields a union of
functions, and calling that requires an argument acceptable to every
member — parameters are contravariant, so for disjoint value types the
callable parameter collapses to `never`. The package once carried a family
of `as never` casts at exactly those argument positions; all were removed
in 2026-08 by restructuring every site into the distributive-object-type
pattern (microsoft/TypeScript#47109, shipped in TS 4.6): write the
operation once, generic in `K`, with key, value, and handler all
referencing the same type parameter, and never let the union-of-functions
form. The casts were real holes, not pedantry — three seeded bugs (wrong
value forwarded, stringified value to a number handler, key passed where
the value belongs) compiled clean in the cast shapes and are rejected as
TS2345 in the current ones. Runtime is unaffected; the restructure added
only a few module-level helpers, verified by bundle diff.

Load-bearing rules for keeping it cast-free (probed on tsc 6.0.3, strict +
`exactOptionalPropertyTypes`):

- A pair travels as one value (`entry[0]`/`entry[1]` — see `ConfigEntry`
  and `applyConfigEntry`); destructuring into separately-typed consts
  decorrelates it.
- Correlation only survives indexing a *syntactic mapped type*. Interfaces
  flatten their members into distributed unions — which is why
  `EditableConfig` is an intersection of two per-domain mapped types
  rather than one conditional mapped type, and why `UserConfig` must stay
  a type alias (interfaces also get no implicit index signature, which
  `stream/makeRefs`'s `Record<string, unknown>` constraint needs).
- `UserConfig` is the hand-written root map; `GMConfig` derives forward
  (`{ [K in keyof UserConfig]: GMConfigItem<UserConfig[K]> }`), never the
  reverse — correlation cannot survive a conditional type backward.
  Deliberately not a Schema-first root: the bundle-size lead in
  `docs/backlog.md` wants the Effect Schema stack out of the bundle.
- `in`-narrowing cannot narrow a generic key, so subset dispatch goes
  through a generic lookup into a `Partial` mapped table that returns the
  correlated handler or `undefined` (`settingUI/SettingHandler`).
- Widening a generic `ConfigEntry<K>` to the full-union `ConfigEntry` at a
  non-generic boundary does not check — a generic indexed access never
  distributes onto the union target — so `makeEntry` keeps one
  construction-class assertion: a checked `ConfigEntry<K>` annotation
  followed by a sound upcast.
- Construction-class assertions remain by design: TS cannot build a
  heterogeneous mapped record through
  `Object.fromEntries`/`R.map`/`fromIterableWith` without one assertion
  (`makeEntry`, the `settingUI/setConfig` table assembly,
  `fromUserConfig`, `setterFromKeysAndMap`, `stream/makeRefs`,
  `makeGetter`, `makePageState`, `makeConfig`). One documented assertion
  each, at the table's construction — don't let them migrate back into
  use sites.

The regression guard is eslint's `assertionStyle: 'never'` plus
`--report-unused-disable-directives`; outside spec fixtures the package
has zero `as never`. Background: microsoft/TypeScript#30581 (correlated
unions — no first-class support as of TS 6), the TS 4.6 release notes on
indexed access inference improvements, and Total TypeScript's "When `as
never` Is The Only Thing That Works".

## eslint 9 migration choices (2026-07)

- `eslint-config-airbnb` and `eslint-config-airbnb-typescript` are
  unmaintained dead ends; `eslint-config-airbnb-extended` replaces both and
  moves import rules to the maintained `eslint-plugin-import-x`.
- `eslint-plugin-consistent-default-export-name` is unmaintained. Its
  export-side rule is replaced by the maintained
  `canonical/filename-match-exported`; no maintained equivalent exists for
  `default-import-match-filename`, so the old plugin survives for that one
  rule behind `@eslint/compat`'s `fixupPluginRules`.
- Many `sharedRules` values pin the pre-migration effective config (extracted
  from `--print-config` snapshots) because airbnb-extended's
  @stylistic-ported defaults would otherwise reformat the committed style.

## Version pins that are deliberate

- `@fp-ts/optic` emits an unmet-peer warning for `@effect/typeclass`: 0.25.0
  is optic's latest release and its peer floor is simply stale. Harmless.
- `webpack-bundle-analyzer` stays on v4 + `@types/webpack-bundle-analyzer`:
  v5 ships no typings at all and DefinitelyTyped has none for it. If its
  types ever mismatch webpack's, check for duplicate webpack instances in the
  lockfile first (`pnpm dedupe` fixed exactly that once).

## pnpm supply-chain policy: v11 defaults, deliberately unconfigured (2026-08)

`pnpm-workspace.yaml` intentionally sets no `minimumReleaseAge`,
`blockExoticSubdeps`, or `trustPolicy`. pnpm 11 already defaults the
first two on (`minimumReleaseAge: 1440` — one day, which covers the
measured detection window of the headline npm incidents —
`blockExoticSubdeps: true`, `strictDepBuilds: true`). Writing
`minimumReleaseAge` explicitly would also flip `minimumReleaseAgeStrict`
on, turning in-window versions into hard resolution failures; the
implicit default runs loose. Raising to 10080 (7 days) was considered
and declined: it delays every routine bump and every fresh security
patch for margin against slow-burn worm waves this unpublished,
no-auto-deploy workspace doesn't especially need. Note `overrides` do
NOT bypass the age gate (since 11.3 the lockfile verification pass
re-checks every entry); a young security patch needs an exact-version
`minimumReleaseAgeExclude` entry — `pnpm audit --fix` writes both
together, and quote scoped entries (`- "@scope/pkg@1.2.3"` — bare `@`
is invalid YAML). `trustPolicy: no-downgrade` is real hardening but
declined for now: `pnpm dedupe` fails under it (pnpm#10329) and
legitimate publisher CI changes false-positive. Context: an automated
"OrbisAI Security" marketing PR (#5, closed unmerged 2026-08) proposed
all three settings — two were no-ops against these defaults.

## External analysis tooling: evaluated and declined (2026-07)

- SonarQube Community Build (self-hosted): its rules largely duplicate the
  existing eslint + whole-program tsc gate, and its differentiators
  (branch/PR analysis, dashboards) are paid-tier or team-scale. If Sonar's
  rules are ever wanted, add `eslint-plugin-sonarjs` to the existing lint
  step — no server; if the want is dashboards, use SonarCloud, not
  self-hosted CE. Revisit only if the project stops being solo-scale.
- TypeScript code-intelligence for coding agents: the official Claude Code
  LSP plugin and the community MCP LSP bridges all wrap the same
  `typescript-language-server`, so neither path locks in any capability.
  If adding one, prefer the official plugin (single client, least setup;
  the MCP bridges were dormant middleware as of 2026-07), and verify it
  actually registers — it had registration bugs mid-2026.

## micro-memoize is bundled, not CDN-required (2026-07)

flow-youtube-chat loads most runtime deps as userscript `@require`s (UMD
globals + webpack externals). micro-memoize left that pattern at v5: its UMD
build reads `global.fastEquals` and `global.fastStringify`, but fast-equals'
own UMD registers `global["fast-equals"]` (and fast-stringify's global
doesn't match either), so the three CDN files cannot see each other without
a shim script. Bundling it (plus those two small deps) costs ~18 KiB and
removes the coordination problem. hash-it stayed a `@require`; its v7 moved
the browser file to `dist/umd/index.js` and dropped the default export
(`import { hash }`).

## flow-youtube-chat streams on Effect, custom-sort stays on rxjs (2026-07)

The flow-youtube-chat reactive layer runs on Effect Stream (v1.20.0): push
sources bridge through queue/PubSub adapters (`src/stream/*`), config change
notification is SubscriptionRef-based, and config side effects live on the
write funnel (`src/configWriteFunnel`, unit-tested) rather than a shared
read path. Two hard-won constraints from that migration: effect values are
built eagerly, so anything reading mutable state written earlier in the
same flow must be `Z.suspend`ed (the setup mount pass and the filterExp
rebuild both broke without it); and thrown exceptions are defects, which
`Stream.retry` ignores — the reinit loop uses a recursive
`Stream.catchAllCause` instead. custom-sort deliberately stays on rxjs: it
has no effect dependency, rxjs arrives free via CDN `@require`, and its
Subjects are push-native mithril event glue. The `@userscript/forward-to`
package therefore survives until custom-sort moves.

## Effect v3 APIs checked and declined (2026-07)

Findings from the v3 API adoption pass (verified against 3.21.4) that were
deliberately not taken; each has a reason beyond inertia:

- `Logger.withLeveledConsole` cannot replace `metaLogger`: it calls the
  console method with a single argument, so it can express neither
  meta-as-second-console-argument (which keeps the object inspectable in
  the browser console) nor the suppression of sub-Warning entries lacking
  meta. Only its idea — route through the `Console` service's `unsafe`
  side — was adopted.
- `stream/throttleLatest` has no v3 replacement: `Stream.throttle` is
  token-bucket shaping and `Stream.debounce` has different semantics;
  neither matches rxjs `throttleTime({leading, trailing})`. v4's native
  throttle is the tracked candidate (`docs/effect-v4-scan.md`).
- `simpleConfig` stays schema-free: it trusts the `GM.getValue(key,
  default)` overload's return type, which lies if storage holds a
  wrong-typed value, but validating would need a schema switched on
  `typeof defaultValue` behind a cast. Adopt only if wrong-typed simple
  values ever actually bite. The other trust boundaries — `Log.importLog`,
  `indirectConfig`, the `lang` key — are schema-validated.
- Traced `Effect.fn` stops at `removeOldChats`: the per-chat functions
  (`getChatLane`, `chatNode`, `setNewChatAnimation`, `setChatPlayState`,
  `onChatFieldMutate`'s callback) stay untraced because a span per chat is
  not free on hot paths. Revisit only if failure attribution proves
  insufficient in practice.

## Multi-step `build` scripts chain with `&&`, not a task runner (2026-07)

Every package's `build` is a plain `pnpm run A && pnpm run B` chain; don't
reintroduce `npm-run-all`/`run-s`. npm-run-all 4.1.5 (its final release)
picks how to launch each child script in `lib/run-task.js` from the *file
extension* of `npm_execpath`, matched against `/\.m?js/`. A `.cjs` path fails
that test, so it execs the file directly (`spawn(pnpm.cjs, ['run', task])`)
instead of via `node` — which needs the executable bit, and corepack's
cached `pnpm.cjs` shim doesn't reliably have it, giving intermittent EACCES.
pnpm's bin was `pnpm.cjs` through v10 and became `pnpm.mjs` at v11 (matches
the regex, run via `node`), so the current pin hides the bug; a `.cjs` bin
would resurrect it. `&&` sidesteps the whole thing (the shell resolves `pnpm`
from PATH — the corepack symlink, `+x` with a shebang) and drops a dead dep.
All uses were sequential; no `run-p` existed.

## Sticker art is read from the renderer's Polymer data (2026-07)

`src/stickerUrl` reads `element.data.sticker.thumbnails` off the
`yt-live-chat-paid-sticker-renderer` custom element rather than its
`#sticker img`, the only place the product touches a Polymer property
instead of the DOM. The DOM is not an option: that `img` holds a 1x1
placeholder GIF until a lazy load that measurably does not happen in
time. Captured evidence (`src/parseChat/fixtures/README.md` explains the
capture tooling): all four `paidSticker` samples show the placeholder
both at insert and in the settled twin up to 10s later, while the
*avatar* in the same renderer loads inside that window; whole-DOM
snapshots taken 30s after attach had the real `lh3.googleusercontent.com`
URL in only three of six stickers. `yt-img-shadow#sticker[loaded]`
tracks the real src exactly and is the signal to watch if this is ever
revisited. There is deliberately no DOM fallback: a fallback that fires
only when the property read fails would be exercised approximately never
and would rot untested — a Schema decode that stops matching means the
shape changed and should fail loudly as a missing sticker, not silently
degrade to an image that is usually a placeholder anyway.

## Chat nodes are cross-realm: instanceof needs the node's window (2026-08)

YouTube's chat DOM lives in the `#chatframe` iframe, so the nodes
flow-youtube-chat handles belong to that iframe's realm. `instanceof`
against the top window's constructors (`Text`, `HTMLImageElement`, …)
fails for them — the iframe has its own constructor identities. Sites
that must narrow a chat node therefore either check `nodeType` or reach
the node's own realm first via `node.ownerDocument.defaultView` (the
`eleWin` pattern in `chatNode`); `fixtureCapture/sanitize` walks nodes
the same way. Comments at those sites carry only the local choice plus a
pointer here.

## Webpack configs run on Node's type stripping, not ts-node (2026-07)

webpack-cli 7 loads a `.ts` config by `import()`ing it and only falls back to
`interpret`/`rechoir` — which demands ts-node, sucrase, babel or tsx — when
that throws. Node >= 24 strips types itself, so the fallback is dead weight
once the import can succeed, and dropping it removes `ts-node` and
`cross-env` from every package.

Making the import succeed is what the config files' odd shapes are for. Each
constraint is Node's ESM resolver being stricter than a bundler:

- Every `config/` script is `.mts`, which is ESM by extension whatever the
  package says. That is the whole reason `tsconfig.package.json` can run on
  `NodeNext`: TypeScript decides a `.ts` file's format from the nearest
  `package.json`, so in a typeless package it would call these CommonJS and
  reject both `import.meta` (TS1470) and import attributes (TS2823/TS2856).
  `.mts` also spares Node the syntax-detection reparse behind its
  `MODULE_TYPELESS_PACKAGE_JSON` warning.
- Sibling configs are imported by their real `.mts` path
  (`./webpack.config.base.mts`), because nothing guesses extensions.
  `allowImportingTsExtensions` in `tsconfig.package.json` is what lets
  TypeScript accept that, and `import-x/extensions` is relaxed for non-`src`
  TS in `@userscript/eslint-config`'s `tsWebpackConfig`.
- Type-only imports say `import type`. Stripping blanks annotations but keeps
  the import statement, and `webpack` has no runtime `Configuration` export.
- No `__dirname`: these files are ESM. `baseConfig`, `tsbaseConfig`,
  `jsbaseConfig` and `devConfig` take `rootDir` as a required argument;
  callers pass `import.meta.dirname` (walked out of `config/` where needed).
  A `process.cwd()` default was tried and dropped: it silently mis-points
  the `@` alias whenever a config is evaluated by a process not started in
  the package directory, as editor tooling does.
- `webpack-userscript` is imported by its `UserscriptPlugin` named export.
  Node's interop hands back `module.exports` and ignores the `__esModule`
  default marker, so the default import is the module object, not the class.
- `package.json` is imported with `with { type: 'json' }` and read off the
  default export; JSON modules have no named exports.
- Emitted `lib/` needs full specifiers too, so `build-lib` passes
  `tsc-alias --resolve-full-paths`; tsc copies specifiers verbatim and a
  directory import fails with `ERR_UNSUPPORTED_DIR_IMPORT`.

`@userscript/webpack-config` and `@userscript/cdn-from-dependency` do declare
`"type": "module"`. Node loads their `lib/*.js` directly when a config
imports them, and a typeless package would make it detect the format and warn
`MODULE_TYPELESS_PACKAGE_JSON` per package scope. It is safe for exactly these
two because webpack never bundles them; both are config-only.

Every package webpack bundles stays typeless, and must. `ui/lib` is emitted
JavaScript that webpack bundles. Marking `ui` as ESM makes webpack apply ESM
interop to it, and ESM interop binds a default import of a CommonJS module to
`module.exports` itself — the same rule that makes `webpack-userscript` need
its named export above. The dependency that proved it (since removed —
`setEditColor` now asks the platform via `CSS.supports('color', value)`) was
`validate-color`: CommonJS with no ESM entry, exporting an object carrying
`__esModule` and a `default` function, so `validateColor(value)` compiled
without complaint into a call on an object. Neither `import d from` nor
`ns.default` reached the inner function — webpack maps both to
`module.exports`.

So the cost of getting the package type wrong is a bundle that builds clean
and throws (or misbehaves) at runtime. Compare `dist/main/index.user.js` byte
for byte before and after anything that touches module resolution.
