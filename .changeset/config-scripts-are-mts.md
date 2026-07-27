---
'@userscript/cdn-from-dependency': major
'@userscript/webpack-config': major
'@userscript/eslint-config': minor
---

Declare `"type": "module"` on the two config-only packages, now that every
`config/` script is `.mts` and imports them as ESM. `packageConfig` lints
`.mts` files and defaults `webpackConfig` to `./config/webpack.config.dev.mts`.
