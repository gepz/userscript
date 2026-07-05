import baseConfig from './baseConfig/index.mjs';

export default [
  {
    ignores: ['eslint.config.mjs'],
  },
  ...baseConfig.map((config) => ({
    ...config,
    files: ['**/*.mjs'],
  })),
  {
    files: ['**/*.mjs'],
    rules: {
      // Node ESM requires explicit file extensions on relative imports;
      // airbnb's extension ban and index-segment trimming assume CJS
      // directory resolution.
      'import-x/extensions': ['error', 'ignorePackages'],
      'import-x/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: false,
        },
      ],
    },
  },
];
