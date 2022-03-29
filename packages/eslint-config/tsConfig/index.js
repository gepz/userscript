const sharedRules = require('../sharedRules');

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    'no-spaced-func': 'off',
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        flatTernaryExpressions: true,
      },
    ],
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
    semi: 'off',
    '@typescript-eslint/strict-boolean-expressions': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    ...sharedRules,
  },
};
