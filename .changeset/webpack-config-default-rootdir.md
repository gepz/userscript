---
'@userscript/webpack-config': minor
---

Default `rootDir` to `process.cwd()` in `baseConfig`, `tsbaseConfig`,
`jsbaseConfig` and `devConfig`, so a webpack config can call them with no
argument instead of deriving the package directory from `__dirname`.
