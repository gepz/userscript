import {
  createTypeScriptImportResolver,
} from 'eslint-import-resolver-typescript';
import {
  createNodeResolver,
} from 'eslint-plugin-import-x';
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
  ...scopedToTs(tsConfig),
  {
    files: TS_FILES,
    settings: {
      // Re-declares airbnb-extended's import-x/resolver-next (settings merge
      // per key, so the whole array must be restated) to pin the TypeScript
      // resolver to this package's project. Left unpinned, it discovers the
      // tsconfig from the linting process's cwd — correct under `pnpm lint`,
      // but an editor's eslint server runs from the workspace root, where
      // discovery misses the package tsconfig and every @/ import reports
      // import-x/no-unresolved.
      'import-x/resolver-next': [
        createNodeResolver({
          extensions: ['.ts', '.cts', '.mts', '.d.ts', '.json'],
        }),
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: path.join(dirname, srcProject),
        }),
      ],
    },
  },
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
