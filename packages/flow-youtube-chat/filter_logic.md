# Filter expression design scratch

Raw working notes for the typed filter-expression system (the WIP
`src/typedExpression` + `src/restrictedExpression` sources; see `plan.md`).
They appear to sketch type-inference steps for curried expression functions
(reading: `{1, 2}`-style sets as in-scope type variables, `->` as the
function arrow), and the final line matches the dot-to-bracket member-access
rewrite implemented in `src/restrictedExpression/DotMemberAccess`. Kept
verbatim as author's notes; not maintained documentation.

```text
{1, 2} (unit) -> {
  a: {1} 1 -> {} ({2} 1 -> 2) -> [1, 2],
  b: {1} 1 -> {2} ({} 1 -> 2) -> [1, 2],
  c: {2} (1 -> 2) -> {} 1 -> [1, 2],
}

g: {1, 2} 2 -> 1
h: {} str -> bool

{}
[unknown, string]
x().a(5)(g)

{}
{} (unknown) -> [unknown, string]
x().a()

{}
{} (unknown) -> {} (unknown) -> [unknown, string]
x().a

{}
{
  a: {} (unknown) -> {} (unknown) -> [unknown, string]
}
x()

{}
(unknown) -> {
  a: {} (unknown) -> {} (unknown) -> [unknown, string]
}
x


tesat.t -> tesat['t']
```
