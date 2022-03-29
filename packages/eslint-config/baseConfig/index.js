const sharedRules = require('../sharedRules');

const path = require(
  'path',
);

module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
  ],
  plugins: ['@typescript-eslint', 'filenames'],
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
    'filenames/match-exported': ['error', ['camel', 'pascal']],
    semi: ['warn', 'always'],
    ...sharedRules,
  },
};
