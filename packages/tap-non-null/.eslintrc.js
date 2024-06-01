const path = require(
  'path',
);

module.exports = {
  root: true,
  extends: ['@userscript/eslint-config/baseConfig'],
  plugins: ['@typescript-eslint'],
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
