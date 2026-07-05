const path = require(
  'path',
);

module.exports = {
  root: true,
  // The src directories below mirror tsconfig.exclude.json: they are excluded
  // from every TS project, so type-aware linting cannot parse them. Keep the
  // two lists in sync; when a directory rejoins the build, unignore it here.
  ignorePatterns: [
    '/lib/',
    '/dist/',
    '/src/filter/filterContextType/',
    '/src/restrictedExpression/',
    '/src/settingUI/EditableExpression/',
    '/src/settingUI/filter/',
    '/src/settingUI/filterPanel/',
    '/src/type/',
    '/src/typedExpression/',
  ],
  extends: [
    '@userscript/eslint-config/baseConfig',
    'plugin:compat/recommended',
  ],
  plugins: ['@typescript-eslint', 'compat'],
  settings: {
    'import/resolver': {
      node: {},
      webpack: {
        config: path.join(__dirname, './config/webpack.config.dev.ts'),
      },
    },
  },
  overrides: [
    {
      files: ['*.ts?(x)'],
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.build.json'),
      },
      extends: ['@userscript/eslint-config/tsConfig'],
    },
    {
      files: ['**/*.ts?(x)'],
      excludedFiles: ['./src/**/*.ts?(x)'],
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
      extends: ['@userscript/eslint-config/tsWebpackConfig'],
    },
  ],
};
