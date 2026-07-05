// Loosened rules for TS files outside src (webpack configs, build scripts).
export default [
  {
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],
    },
  },
];
