---
'@userscript/ui': patch
---

Validate colours in `setEditColor` with the browser's own parser
(`CSS.supports('color', value)`) instead of the `validate-color` package,
which is dropped as a dependency.
