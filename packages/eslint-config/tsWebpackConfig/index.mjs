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
      // Node runs these files straight from source through its type
      // stripping, and its ESM resolver never guesses an extension, so a
      // sibling is imported by the .ts path it actually has on disk.
      'import-x/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'always',
        },
      ],
    },
  },
];
