const sharedRules = require('../sharedRules');

module.exports = {
  env: {
    browser: true,
  },
  plugins: [
    'import-newlines',
    '@stylistic',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@stylistic/recommended-extends',
    'airbnb-base',
    'plugin:consistent-default-export-name/fixed',
    'plugin:@stylistic/disable-legacy',
  ],
  rules: {
    'import/no-extraneous-dependencies': [
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
    'no-multiple-empty-lines': [
      'error', {
        max: 1,
        maxBOF: 0,
      },
    ],
    'func-names': ['error', 'as-needed'],
    ...sharedRules,
  },
};
