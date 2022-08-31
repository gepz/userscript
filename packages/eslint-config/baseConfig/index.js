const sharedRules = require('../sharedRules');

module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:consistent-default-export-name/fixed',
  ],
  plugins: ['@typescript-eslint'],
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
    indent: [
      'error', 2, {
        flatTernaryExpressions: true,
      },
    ],
    'no-multiple-empty-lines': [
      'error', {
        max: 1,
      },
    ],
    'func-names': ['error', 'as-needed'],
    semi: ['warn', 'always'],
    ...sharedRules,
  },
};
