import path from 'node:path';

import baseConfig from '../baseConfig/index.mjs';
import tsConfig from '../tsConfig/index.mjs';
import tsWebpackConfig from '../tsWebpackConfig/index.mjs';

// .mts is how the config/ scripts declare themselves ESM without their package
// doing so; docs/decisions.md explains why the package cannot.
const TS_FILES = ['**/*.ts', '**/*.tsx', '**/*.mts'];

const scopedToTs = (configs) => configs.map((config) => ({
  ...config,
  files: TS_FILES,
}));

// Standard config for a workspace package: TS-only linting, type-aware
// rules bound to srcProject, with TS files outside src (webpack config
// scripts) parsed against configProject instead.
export default ({
  dirname,
  ignores = [],
  webpackConfig = './config/webpack.config.dev.mts',
  srcProject = 'tsconfig.build.json',
  configProject = 'tsconfig.json',
  append = [],
}) => [
  {
    ignores: [
      'lib/',
      'dist/',
      // Only TS is linted, matching the pre-flat-config `--ext .ts` setup.
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      ...ignores,
    ],
  },
  ...scopedToTs(baseConfig),
  {
    files: TS_FILES,
    settings: {
      'import-x/resolver': {
        node: {},
        webpack: {
          config: path.join(dirname, webpackConfig),
        },
      },
    },
  },
  ...scopedToTs(tsConfig),
  {
    files: TS_FILES,
    languageOptions: {
      parserOptions: {
        project: path.join(dirname, srcProject),
      },
    },
  },
  ...tsWebpackConfig.map((config) => ({
    ...config,
    files: TS_FILES,
    ignores: ['src/**'],
    languageOptions: {
      parserOptions: {
        project: path.join(dirname, configProject),
      },
    },
  })),
  ...append,
];
