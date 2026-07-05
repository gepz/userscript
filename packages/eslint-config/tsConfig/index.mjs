import {
  configs as airbnb,
  plugins as airbnbPlugins,
} from 'eslint-config-airbnb-extended';
import tseslint from 'typescript-eslint';

import sharedRules from '../sharedRules/index.mjs';

export default [
  airbnbPlugins.typescriptEslint,
  ...airbnb.base.typescript,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variableLike',
          format: ['camelCase'],
        },
        {
          selector: 'variableLike',
          format: null,
          filter: {
            regex: '^.*_$',
            match: true,
          },
        },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
        },
      ],
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/restrict-template-expressions': 'error',
      ...sharedRules,
    },
  },
];
