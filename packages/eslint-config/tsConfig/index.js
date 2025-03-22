const sharedRules = require('../sharedRules');

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import-newlines',
    '@stylistic',
  ],
  extends: [
    '@kesills/airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
    'plugin:import/typescript',
    'plugin:@stylistic/disable-legacy',
  ],
  rules: {
    'no-spaced-func': 'off',
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
};
