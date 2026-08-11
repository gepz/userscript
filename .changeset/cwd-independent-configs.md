---
"@userscript/webpack-config": major
"@userscript/eslint-config": major
---

Make config evaluation cwd-independent. webpack-config's `baseConfig`,
`tsbaseConfig`, `jsbaseConfig`, and `devConfig` now require `rootDir` instead
of defaulting it to `process.cwd()`. eslint-config's `packageConfig` pins the
import resolver (`import-x/resolver-next` with the TypeScript resolver bound
to `srcProject`) so `@/` imports resolve regardless of the linting process's
cwd; the dead legacy webpack-resolver settings and the `webpackConfig`
factory option are removed, and the `eslint-import-resolver-webpack` peer
dependency is replaced by `eslint-import-resolver-typescript`.
