# @userscript/webpack-config

## 2.0.0

### Major Changes

- abc0ea7: Declare `"type": "module"` on the two config-only packages, now that every
  `config/` script is `.mts` and imports them as ESM. `packageConfig` lints
  `.mts` files and defaults `webpackConfig` to `./config/webpack.config.dev.mts`.

  Their `exports` maps now name the target directly instead of splitting
  `import` from `require` to reach the same file, and `webpack-config` drops a
  `main` and `types` that pointed at files it has never had.

- bf1b6cc: Remove the `styleLoaderConfig` fragment. No package imports a `.css` file, so
  its `test: /\.css$/` rule matched no module.

### Minor Changes

- 11a51e3: Default `rootDir` to `process.cwd()` in `baseConfig`, `tsbaseConfig`,
  `jsbaseConfig` and `devConfig`, so a webpack config can call them with no
  argument instead of deriving the package directory from `__dirname`.

### Patch Changes

- fcc7d92: Emit fully resolved relative specifiers in `lib` (`../baseConfig/index.js`
  rather than `../baseConfig`), so Node's own ESM resolver can load the
  package without a bundler or ts-node in front of it.

## 1.0.6

### Patch Changes

- f59abaf: Declare `typescript` as a devDependency; `build-lib` runs `tsc`, which
  previously resolved from whatever the environment happened to provide.

## 1.0.5

### Patch Changes

- 5c48122: update dependencies

## 1.0.4

### Patch Changes

- 585837b: update dependencies
- refine chat detection

## 1.0.3

### Patch Changes

- update package configs

## 1.0.2

### Patch Changes

- add type: "module"

## 1.0.1

### Patch Changes

- 8e2a4ab: initial
