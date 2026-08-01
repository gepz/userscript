# @userscript/eslint-config

## 1.2.0

### Minor Changes

- abc0ea7: Declare `"type": "module"` on the two config-only packages, now that every
  `config/` script is `.mts` and imports them as ESM. `packageConfig` lints
  `.mts` files and defaults `webpackConfig` to `./config/webpack.config.dev.mts`.

  Their `exports` maps now name the target directly instead of splitting
  `import` from `require` to reach the same file, and `webpack-config` drops a
  `main` and `types` that pointed at files it has never had.

### Patch Changes

- 11a51e3: Require the `.ts`/`.mts` extension on relative imports in TS files outside
  `src` (`tsWebpackConfig`), matching how Node resolves the webpack configs it
  runs from source.

## 1.1.5

### Patch Changes

- 6f3b87f: modify max len config

## 1.1.4

### Patch Changes

- 77e9141: Update padding line between statements config

## 1.1.3

### Patch Changes

- 5d67145: update

## 1.1.2

### Patch Changes

- 37bfabe: fix

## 1.1.1

### Patch Changes

- e677b62: update config

## 1.1.0

### Minor Changes

- 37898bc: Update eslint configs for new dependencies

## 1.0.4

### Patch Changes

- 5c48122: update dependencies

## 1.0.3

### Patch Changes

- refine chat detection

## 1.0.2

### Patch Changes

- update package configs

## 1.0.1

### Patch Changes

- 8e2a4ab: initial
