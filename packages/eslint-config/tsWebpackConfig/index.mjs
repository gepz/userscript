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
      // Siblings must be imported by their real .ts/.mts path — see the
      // webpack-configs section of docs/decisions.md.
      'import-x/extensions': [
        'error',
        'ignorePackages',
        {
          mts: 'always',
          ts: 'always',
        },
      ],
    },
  },
];
