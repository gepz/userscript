# Correlated-union casts in flow-youtube-chat

Status tracker for removing the `as never` family of casts (2026-08). This
is the single home for the mechanism; code comments at the sites should
carry only the local constraint plus a pointer here. Update the inventory
and phase checklists as work lands; delete this file when the last phase
closes and fold anything still worth knowing into `docs/decisions.md`.

**Status: all four phases implemented and browser-verified 2026-08;
nothing open — fold and delete when convenient.**

## The mechanism

flow-youtube-chat keeps per-key config machinery in records indexed by
`keyof UserConfig` (setters, dispatch tables, GM codecs). TypeScript loses
the correlation between a key and its value the moment they travel
separately: destructure `[key, val]` from a union of pairs and `key` and
`val` become two independent unions. Indexing a record of functions with a
union key then yields a union of function types, and calling a union of
functions requires an argument acceptable to every member — parameters are
contravariant, so the callable parameter is the intersection of all
per-key value types, which for disjoint types collapses to `never`. The
`as never` casts are argument-position escape hatches for exactly this.

Two aggravations appear at some sites:

- `in`-narrowing does not narrow a generic type parameter, so
  `k in setComputed` cannot make `setComputed[k]` indexable
  (`settingUI/updateAt`, `settingUI/getState`).
- Correlation cannot survive a conditional type backward. `UserConfig` is
  currently inferred out of `GMConfig` via
  `GMConfig[P] extends GMConfigItem<infer R2> ? R2 : never`, so TS cannot
  prove `defaultGMConfig[key].toGm` accepts `UserConfig[key]`
  (`initialize`).

The correlation is *preserved* when a single generic key indexes a
homomorphic mapped type directly — `c.setConfig[k](v)` with
`k: T extends keyof UserConfig` needs no cast (verified 2026-08; the
vestigial cast in `configEffect` was removed then). The refactor is about
arranging every site into that shape.

## Why bother

`as never` at an argument position is an unchecked hole: it accepts any
expression. Verified 2026-08 against this repo's tsc (6.0.3, strict +
`exactOptionalPropertyTypes`) on model files mirroring the three site
shapes: three seeded bugs — forwarding `String(val)` instead of `val`,
passing a stringified value to a number-typed handler, passing the key
where the value belongs — all compile clean in the current shapes and are
all rejected as TS2345 in the restructured shapes. The restructure also
rejects mismatched pairs (`['font', 42]`) at the boundary.

Runtime is unaffected either way: casts erase, and the restructured
version adds only a couple of module-level helper functions. The only
measurable cost is checker time, negligible at this scale.

## Target pattern

The distributive-object-type pattern (microsoft/TypeScript#47109). Write
the operation once, generic in `K`, where key, value, and setter all
reference the same type parameter; never let the union-of-functions form.
Callers may instantiate `K` with the full union freely — the body was
checked with the correlation intact.

```ts
type Entry<K extends keyof UserConfig = keyof UserConfig> = {
  [P in K]: [P, UserConfig[P]];
}[K];

const applyEntry = <K extends keyof UserConfig>(
  setters: UserConfigSetter,
  entry: Entry<K>,
) => setters[entry[0]](entry[1]); // no cast; mismatched pairs rejected
```

Load-bearing details: the pair stays one value (`entry[0]`/`entry[1]`,
not destructured into separately-typed consts), and lookups go through
mapped types derived forward from one root map. For subset dispatch
tables, a generic accessor into a `Partial` mapped type returns the
correlated handler or `undefined`, replacing `in`-narrowing entirely:

```ts
type HandlerTable = { [K in SettingKey<unknown>]?: Handler<K> };
const lookup = <K extends SettingKey<unknown>>(
  table: HandlerTable, k: K,
): Handler<K> | undefined => table[k];
```

Declare tables with `satisfies` where the precise inferred type still
matters downstream, or a plain annotation where it does not.

The root map goes the other way around from today: `UserConfig` becomes
the hand-written source and `GMConfig` derives forward
(`{ [K in keyof UserConfig]: GMConfigItem<UserConfig[K]> }`).
Deliberately **not** a Schema-first root: the bundle-size lead in
`docs/backlog.md` wants the Effect Schema stack (~58 KB) out of the
bundle, so the root stays a plain type.

## Inventory (line numbers as of 2026-08, commit a96f083)

In scope — correlated-union casts. **All removed (2026-08)**; the
package has zero `as never` left outside spec fixtures. The refactor
added two construction-class assertions in exchange (`makeEntry` in
`ConfigEntry`, the `setConfig` table assembly) — see the phase notes.

| Site | Cast | Phase |
| --- | --- | --- |
| `initialize/index.ts:93` | `x.toGm(val as never)` | 1 |
| `initialize/index.ts:86` | `[key, val] as {…}[keyof UserConfig]` | 2 |
| `allStream/index.ts:221` | `setChangedConfig[key](val as never)` | 2 |
| `settingUI/updateAt/index.ts:22` | `setComputed[k as never] as (…)` | 3 |
| `settingUI/updateAt/index.ts:29` | `setState[k] as (…)` | 3 |
| `settingUI/updateAt/index.ts:43` | `k as keyof UserConfigSetter` | 3 |
| `settingUI/updateAt/index.ts:46` | `(… ? Ed.value(v) : v) as never` | 3 |
| `settingUI/getState/index.ts:10` | `computed[k as never]`, `s[k as never]` | 3 |
| `setSettingFromConfig/index.ts:20` | `state[key] as Editable<UserConfig[T]>` | 4 |

Out of scope — same disable comment, different limitation. Do not fold
these in; they are construction casts (TS cannot build a heterogeneous
mapped record through `Object.fromEntries`/`R.map`/`fromIterableWith`
without one assertion) or unrelated:

- `EditableConfig` `fromUserConfig`, `setterFromKeysAndMap`,
  `stream/makeRefs`, `UserConfigGetter` `makeGetter`,
  `LivePageState` `makePageState`, `UserConfig` `makeConfig` —
  construction class; keep the one documented assertion each.
- DOM/cross-realm casts (`cloneNode`, `Element` to `HTMLElement`),
  `filter/evaluateExpression`'s jsep narrowing, spec fixture slices,
  `Stream.mergeAll`/`zipWithPrevious` explicit type arguments (truthful
  E/R channels forced by all-or-nothing type arguments), and mapped-type
  `: never` arms.

## Plan

Each phase is independently shippable and behavior-neutral (no changeset;
type-level plus tiny helpers). Verification per phase:
`npx tsc -p tsconfig.build.json --noEmit`, `npx eslint .
--report-unused-disable-directives` (both must stay clean — the second
proves the removed disables are really gone), and a `pnpm build` bundle
diff against the previous commit to confirm the runtime output is
unchanged up to the new helpers.

### Phase 1 — invert the root derivation (done 2026-08)

- [x] Write `UserConfig` as the plain key-to-value map (source of truth).
- [x] Derive `GMConfig` forward:
      `{ [K in keyof UserConfig]: GMConfigItem<UserConfig[K]> }`.
- [x] Confirm `defaultGMConfig` still checks against the derived
      `GMConfig` (it defines codecs; the annotation direction flips).
- [x] Remove `initialize/index.ts:93` (`toGm(val as never)`); no helper
      was needed — `broadcastAndPersist`'s contextual type
      (`configWriteFunnel`) already keeps `key` generic at the call site.

Findings: `UserConfig` must stay a *type alias* (one
`consistent-type-definitions` disable) — interfaces get no implicit index
signature, which `stream/makeRefs`'s `Record<string, unknown>` constraint
needs. Bundle verified byte-identical to the pre-phase build.

### Phase 2 — broadcast entry (done 2026-08)

- [x] `ConfigEntry<K>` (distributive object type over `UserConfig`) in
      `src/ConfigEntry`; the channel's message type in `initialize` and
      `allStream`.
- [x] Generic `applyConfigEntry` helper (`src/applyConfigEntry`);
      `allStream`'s `Stream.mapEffect` callback passes the
      un-destructured entry through it, and the
      `listeningBroadcastConfigKeys` gate reads `entry[0]` without
      splitting the pair.
- [x] Remove `initialize/index.ts:86` (postMessage tuple cast) and
      `allStream/index.ts:221`.

Findings: consuming and constructing `ConfigEntry<K>` generically both
check, but *widening* `ConfigEntry<K>` to the full-union `ConfigEntry`
at a non-generic boundary (`channel.postMessage`) does not — a generic
indexed access never distributes onto the union target (probed against
tsc 6.0.3; the conditional-type formulation widens but then refuses the
construction, and the two forms don't interconvert). So `makeEntry` in
`src/ConfigEntry` keeps one construction-class assertion: a checked
`ConfigEntry<K>` annotation followed by a sound upcast. Net for the
phase: two unchecked use-site casts became one checked-construction
boundary. Bundle diff: only the two helpers, call shapes unchanged.

### Phase 3 — dispatch tables (done 2026-08)

- [x] `SettingHandler<K>` / `SettingHandlerTable` / generic
      `lookupHandler` in `settingUI/SettingHandler`. The existing
      `setComputed` and `setState` turned out to be assignable to
      `SettingHandlerTable` as declared — no re-annotation needed.
- [x] `updateAt` became a `lookupHandler(setComputed, k) ??
      lookupHandler(setState, k) ?? lookupHandler(setConfig, k)` chain
      with an `undefined` check; `getState` got the same via a local
      getter table plus a `StateView` partial mapped view of
      `SettingState` (state reads correlate through the view; the
      `undefined` tail is an unreachable throw, since `computed` covers
      every non-state key by construction of `SettingKey`).
- [x] The `k in c.setConfig` branch became `settingUI/setConfig`: a
      handler table over `configKeys` built from two per-class generic
      handlers (`editableHandler` unwraps via `Ed.value`,
      `plainHandler` passes through), each fully checked; the table
      assembly keeps one construction-class assertion
      (`fromIterableWith` erases per-key types), mirroring
      `setterFromKeysAndMap`.
- [x] All six casts in `updateAt`/`getState` removed.

Findings that unlocked the phase:

- Interfaces flatten their members, so `SettingState[K]` and
  `SettingProps[K]`-via-`AppPropertiesValue` resolve to distributed
  unions, not correlated types. Correlation only survives indexing a
  *syntactic mapped type*. Hence `EditableConfig` was restructured from
  one conditional mapped type into an intersection of two per-domain
  mapped types (`EditableConfigValues` & plain rest) — same concrete
  shape, correlated generic indexing.
- `SettingProps[K]` needs no resolution at the dispatch layer: handler
  and argument share the written type `SettingProps[K]`, so the calls
  check by identity.

- [x] Exercise the panel per the package's `verify` skill
      (`packages/flow-youtube-chat/.claude/skills/verify/SKILL.md`) —
      done 2026-08-03: every dispatch path driven headlessly (computed
      `useStepTiming`, plain `textOnly`/`toggleCreateComments`, editable
      `flowSpeed`/banned lists incl. invalid-input rejection and
      `filterExp` rebuild), plus the `ConfigEntry` broadcast verified
      across two pages (`bannedWords`, `fieldScale`); zero page errors.

### Phase 4 — `setSettingFromConfig` (done 2026-08, cast removed)

The doc originally listed this as decide-maybe-keep; Phase 3's
`EditableConfigValues` settled it. `isEditableKey(key)` narrows the
generic `key` to `T & EditableConfigKey`, and indexing the
`EditableConfigValues` *mapped type* (via an upcast view of the state,
`const editables: EditableConfigValues = state`) with that key yields
the correlated `Editable<UserConfig[T & EditableConfigKey]>` —
`Ed.setValue(value)` then checks with no assertion.

- [x] Implemented; `state[key] as Editable<UserConfig[T]>` removed.

## Constraints and notes

- TS 6.0.3 today; the TS 7 (Go) migration in `docs/backlog.md` makes
  checker-time concerns even less relevant, and nothing here uses syntax
  TS 7 removes.
- TS 5.8+ checked returns for conditional/indexed-access types cover
  explicit per-key `if (k === '…')` branching without casts — useful if
  any site ends up enumerating keys, but table dispatch still needs the
  pattern above.
- Effect v4 (backlog) retypes some of the same files; land this first —
  smaller diff, and v4's migration then happens on cast-free code.
- The eslint rule stays `assertionStyle: 'never'`; success per phase is
  measured in deleted `eslint-disable` lines, with
  `--report-unused-disable-directives` as the regression guard.

## References

Primary sources:

- [microsoft/TypeScript#30581](https://github.com/microsoft/TypeScript/issues/30581)
  — correlated unions, the canonical open issue (filed by jcalz, whose
  Stack Overflow answers are the main body of applied examples — e.g.
  [discriminated-unions type matching](https://stackoverflow.com/questions/74435769/discriminated-unions-type-matching));
  no first-class language support as of TS 6.
- [microsoft/TypeScript#47109](https://github.com/microsoft/TypeScript/pull/47109)
  — "Fix multiple issues with indexed access types applied to mapped
  types" (merged 2021-12, shipped in TS 4.6): the distributive-object-type
  pattern this plan applies.
- [TS 4.6 release notes — Indexed Access Inference Improvements](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-6.html#indexed-access-inference-improvements)
  — the official write-up of #47109; the adjacent "Control Flow Analysis
  for Dependent Parameters" section covers the rest-tuple destructuring
  variant.

Introductions (content verified 2026-08; no video coverage of this
specific issue was found, only general `never`/union-distribution
material):

- [When `as never` Is The Only Thing That Works](https://www.totaltypescript.com/as-never)
  (Total TypeScript) — exactly this repo's situation: indexing a record
  of formatters with a union key yields a union of functions whose
  parameter resolves to `never`, and `as never` as the sanctioned
  escape hatch.
- [A complete guide to TypeScript's never type](https://www.zhenghao.io/posts/ts-never)
  (Zhenghao He) — `never` as the empty set, including how it surfaces
  from implicit intersections in error messages.
- [Covariance and Contravariance in TypeScript](https://dmitripavlutin.com/typescript-covariance-contravariance/)
  (Dmitri Pavlutin) — background on why function parameters are
  contravariant, the mechanism behind the intersection collapse.
