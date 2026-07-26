# Backlog

Work worth doing, roughly ordered — repo-level items first, then the
flow-youtube-chat bugs and wishlist. Remove items when done; re-verify
versions before starting, this list ages.

## Security / correctness

### hyperapp is dormant upstream

2.0.22 final, typings papered over by `hyperappDomCompat.d.ts`.
Long-term: migrate off or vendor.

## Cleanup

### Delete the unused CSS build pipeline

Nothing imports a `.css` file in either userscript, so the `test: /\.css$/`
rule in `webpack-config`'s `styleLoaderConfig` matches no module.
flow-youtube-chat's styles are a template string in `src/mainCss`, appended
as a `<style>` element. The chain would not survive being used either: both
`postcss.config.js` files name `tailwindcss` as a plugin and neither package
has it installed, so the first `.css` import fails the build. Removable:
`styleLoaderConfig` and the two `webpack.config.base.ts` merges of it, the
`style-loader`, `css-loader`, `postcss-loader`, `autoprefixer` and `postcss`
devDependencies, and both `postcss.config.js`.

## flow-youtube-chat bugs

### Max chat amount removes chats prematurely

Max chat amount sometimes misbehaves, removing chats before they
should go.

## Design decisions pending

### Decide the fate of the typed filter-expression editor WIP

A typed, restricted expression system meant to power a type-checked
editing UI for user-defined chat filters (~3.2k lines across
`src/type`, `src/typedExpression`, `src/restrictedExpression`,
`src/settingUI/{filter,filterPanel,EditableExpression}`,
`src/filter/filterContextType`; all excluded via `tsconfig.exclude.json`,
while the old panel `filterPanelOld` still ships).
With `expression-eval` replaced by `jsep` + `src/filter/evaluateExpression`,
this is editor UX work, not security work. Options: finish as designed
(generic type inference; two files still have mid-edit syntax errors),
rescope to first-order type checking in direct-style TypeScript, or delete
the WIP. Design scratch notes live in
`packages/flow-youtube-chat/filter_logic.md`.

## Dependency majors (deferred deliberately)

### webpack-bundle-analyzer 5

Ships no typings — see `docs/decisions.md`.

### Effect v4

Beta since early 2026, will be LTS: single-version ecosystem,
much smaller core, and a built-in `Optic` module that replaces the frozen
`@fp-ts/optic` (v0.25.0, stale peer floor). Migrate when v4 is stable,
not during beta. Pain points pre-scanned in `docs/effect-v4-scan.md`
(2026-07): the big items are Option-as-Effect subtyping removal,
`Either`→`Result`, and `@effect/typeclass` having no v4 counterpart —
which makes deciding the filter-editor WIP's fate (above) a prerequisite.
The `FiberRef`→`Context.Reference` logger rewrite was pulled forward into
v3 (2026-07, `docs/effect-v3-adoption.md`); only the logger-callback
shape change and `References.MinimumLogLevel` remain there.

### TypeScript 6.x

Once typescript-eslint supports it.

### eslint 10

Blocked on plugin ecosystem (`eslint-config-airbnb-extended`,
`eslint-plugin-canonical`, the compat-shimmed
`eslint-plugin-consistent-default-export-name`,
`eslint-plugin-import-newlines` v2 for eslint 10 support).

## Build pipeline (waiting on webpack experiments to stabilize)

### Replace `ts-loader` with native type-stripping

`experiments.typescript`, since webpack 5.108 (checked 2026-07; re-verify
experiment status before starting). It uses the same type erasure the
webpack configs themselves already run on, so the constraints are the ones
`docs/decisions.md` lists. Stripping handles erasable syntax only; the two
remaining `enum`s (`src/type/UI`, `src/type/Primitive`, re-verified 2026-07)
sit in the build-excluded filter-editor WIP and only block this if that WIP
ships (its `const`-object refactor is worth doing regardless — TypeScript's
`erasableSyntaxOnly` direction). fork-ts-checker remains the type gate
either way; stripping does no checking.

## flow-youtube-chat wishlist

A wishlist, not commitments; verify against `src/` before starting one.

### Reduce build size

Measured 2026-07 (`pnpm analyze`, parsed sizes):
the 533 KB pre-prettify bundle (137 KB gzipped on the wire) is 90%
`effect` (482 KB); everything else is noise (src 25 KB, next-largest
dependency 5 KB), and the four CDN `@require` externals already cover
every dependency that ships a usable browser global — `effect` has no
UMD build, so it cannot move there. Leads, largest first: the Schema
stack (~58 KB: Schema + SchemaAST + ParseResult) is only used for
config validation and could be replaced by hand-rolled checks; `stm`
(13.5 KB) and `Micro` (12.9 KB) look unused and may be shakeable via
`effect/*` subpath imports instead of the barrel; the rest is the
runtime + Stream actually in use, where only the Effect v4 migration
(above) moves the needle.

### Display matrix

A settings grid controlling, per chat type, which components of a chat
to flow — never implemented, commented out since the first commit.
Remnants: the `displayMatrix` config item stub in `GMConfig`, its
default value and compact string codec in `defaultGMConfig`, and render
code for a 3-column grid of on/off cells in `settingUI/flowChatPanel`.
The row/column semantics were never written down; the shape (four rows,
up to three columns) suggests chat-type rows (normal, moderator,
superchat, membership) × component columns (avatar, author name,
message), generalizing the one-off `displayModName`,
`displaySuperChatAuthor`, and `textOnly` toggles. Treat the commented
code as a sketch: decide the semantics fresh, and decide whether the
three existing toggles fold into the matrix or stay.

### Auto block user

### Per site settings

### Auto reload

### Banned lane

### Performance tab

### Reset default settings

### Shadow color v2
