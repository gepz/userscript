---
'@userscript/webpack-config': patch
---

Declare `typescript` as a devDependency; `build-lib` runs `tsc`, which
previously resolved from whatever the environment happened to provide.
