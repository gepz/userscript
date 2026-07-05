# @userscript/webpack-config

Shared webpack configuration fragments for all packages: base config,
ts-loader (transpile-only), fork-ts-checker whole-program type checking,
style loaders, dev server, and umd-library output. Package configs under
`packages/*/config/webpack.config.*.ts` merge these fragments.

Internal workspace package, consumed via `workspace:` symlink into the
committed [`lib/`](lib) output.

```sh
pnpm build-lib   # tsc + tsc-alias into lib/ — rebuild and commit after changes
```
