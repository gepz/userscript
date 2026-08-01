# @userscript/cdn-from-dependency

## 2.0.0

### Major Changes

- abc0ea7: Declare `"type": "module"` on the two config-only packages, now that every
  `config/` script is `.mts` and imports them as ESM. `packageConfig` lints
  `.mts` files and defaults `webpackConfig` to `./config/webpack.config.dev.mts`.

  Their `exports` maps now name the target directly instead of splitting
  `import` from `require` to reach the same file, and `webpack-config` drops a
  `main` and `types` that pointed at files it has never had.

## 1.0.4

### Patch Changes

- 5c48122: update dependencies

## 1.0.3

### Patch Changes

- 585837b: update dependencies
- refine chat detection

## 1.0.2

### Patch Changes

- update package configs

## 1.0.1

### Patch Changes

- 8e2a4ab: initial
