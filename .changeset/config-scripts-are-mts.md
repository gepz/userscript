---
'@userscript/cdn-from-dependency': major
'@userscript/webpack-config': major
'@userscript/eslint-config': minor
---

Declare `"type": "module"` on the two config-only packages, now that every
`config/` script is `.mts` and imports them as ESM. `packageConfig` lints
`.mts` files and defaults `webpackConfig` to `./config/webpack.config.dev.mts`.

Their `exports` maps now name the target directly instead of splitting
`import` from `require` to reach the same file, and `webpack-config` drops a
`main` and `types` that pointed at files it has never had.
