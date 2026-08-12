import path from 'node:path';

import packageConfig from '@userscript/eslint-config/packageConfig';
import compat from 'eslint-plugin-compat';

import ts from 'typescript';

// src directories excluded from every TS project cannot be type-aware
// linted, so they are ignored — derived from tsconfig.exclude.json
// rather than mirrored by hand. Read through TypeScript's own config
// reader because the file is JSONC, which Node's JSON import rejects.
// The list's non-src entries need no ignore here: generated output is
// ignored by packageConfig and spec files are linted against the spec
// program below.
const excludedSrcDirs = ts.readConfigFile(
  path.join(import.meta.dirname, 'tsconfig.exclude.json'),
  ts.sys.readFile,
).config.exclude
  .filter((entry) => entry.startsWith('./src/'))
  .map((entry) => `${entry.slice(2)}/`);

export default packageConfig({
  dirname: import.meta.dirname,
  ignores: excludedSrcDirs,
  append: [
    {
      ...compat.configs['flat/recommended'],
      files: ['**/*.ts', '**/*.tsx'],
    },
    // Spec files are excluded from tsconfig.build.json, so type-aware
    // linting parses them against the spec program instead.
    {
      files: ['src/**/*.spec.ts'],
      languageOptions: {
        parserOptions: {
          project: path.join(import.meta.dirname, 'tsconfig.spec.json'),
        },
      },
    },
    // Effect's effect-defining idiom is an anonymous generator handed to
    // Effect.gen / Effect.fn; naming every one to satisfy func-names is pure
    // ceremony, so exempt generators here rather than scatter disables.
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'func-names': ['error', 'as-needed', { generators: 'never' }],
      },
    },
  ],
});
