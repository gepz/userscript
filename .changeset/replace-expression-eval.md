---
'@userscript/flow-youtube-chat': minor
---

Replace deprecated `expression-eval` (unmaintained, open security advisory)
with the maintained `jsep` parser — already CDN-required, previously unused —
plus a built-in restricted interpreter (`src/filter/evaluateExpression`) for
user filter expressions. The interpreter only reads own properties (no
prototype chain, no `__proto__`/`constructor`/`prototype`), rejects `this`
and bitwise operators, and throws on identifiers missing from the filter
scope instead of yielding `undefined`. jsep 1.4's typings are patched
(`export =` to `export default`) to pass the bare-tsc CI gate under ES module
output.
