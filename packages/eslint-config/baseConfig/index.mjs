import {
  fixupPluginRules,
} from '@eslint/compat';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import {
  configs as airbnb,
  plugins as airbnbPlugins,
} from 'eslint-config-airbnb-extended';
import canonical from 'eslint-plugin-canonical';
import consistentDefaultExportName from 'eslint-plugin-consistent-default-export-name';
import importNewlines from 'eslint-plugin-import-newlines';
import globals from 'globals';

import sharedRules from '../sharedRules/index.mjs';

export default [
  js.configs.recommended,
  airbnbPlugins.stylistic,
  airbnbPlugins.importX,
  ...airbnb.base.recommended,
  stylistic.configs.recommended,
  {
    plugins: {
      'import-newlines': importNewlines,
      canonical,
      // Kept only for default-import-match-filename; the export-side rule
      // moved to the maintained canonical/filename-match-exported. The
      // plugin predates eslint 9, hence the fixup shim.
      'consistent-default-export-name':
        fixupPluginRules(consistentDefaultExportName),
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'canonical/filename-match-exported': 'error',
      'consistent-default-export-name/default-import-match-filename': 'error',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],
      'no-shadow': [
        'error', {
          allow: ['_'],
        },
      ],
      '@stylistic/no-multiple-empty-lines': [
        'error', {
          max: 1,
          maxBOF: 0,
        },
      ],
      'func-names': ['error', 'as-needed'],
      ...sharedRules,
    },
  },
];
