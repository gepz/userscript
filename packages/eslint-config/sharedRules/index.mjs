// Rules shared by the JS and TS fragments. Formatting rules use the
// @stylistic namespace; the legacy core copies are deprecated in eslint 9
// and removed in eslint 10.
export default {
  '@stylistic/padding-line-between-statements': [
    'error',
    {
      blankLine: 'always',
      prev: [
        'block',
        'block-like',
        'import',
        'export',
        'cjs-import',
        'cjs-export',
        'class',
        'multiline-const',
        'multiline-expression',
        'multiline-let',
        'multiline-var',
        'interface',
        'type',
        'enum',
      ],
      next: '*',
    },
    {
      blankLine: 'any',
      prev: ['export', 'cjs-export'],
      next: ['export', 'cjs-export'],
    },
    {
      blankLine: 'any',
      prev: ['import', 'cjs-import'],
      next: ['import', 'cjs-import'],
    },
  ],
  'import-x/order': [
    'error',
    {
      alphabetize: {
        order: 'asc',
      },
      groups: [
        ['builtin', 'external'],
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
      ],
      'newlines-between': 'always',
    },
  ],
  // Explicit options: severity-only entries inherit options from extended
  // configs, so a bare ['error'] here silently kept airbnb's props: true.
  // Userscripts mutate DOM elements passed as parameters by design.
  'no-param-reassign': [
    'error', {
      props: false,
    },
  ],
  '@stylistic/no-mixed-operators': [
    'error', {
      allowSamePrecedence: true,
    },
  ],
  '@stylistic/object-curly-newline': [
    'error', {
      multiline: true,
      minProperties: 1,
    },
  ],
  '@stylistic/max-len': [
    'error', {
      code: 88,
    },
  ],
  '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
  '@stylistic/object-property-newline': [
    'error',
    {
      allowAllPropertiesOnSameLine: false,
    },
  ],
  '@stylistic/array-element-newline': ['error', 'consistent'],
  '@stylistic/array-bracket-newline': [
    'error', {
      multiline: true,
    },
  ],
  'no-nested-ternary': ['off'],
  'max-params': ['error', 6],
  '@stylistic/max-statements-per-line': ['error'],
  'import-newlines/enforce': [
    'error',
    0,
  ],
  '@stylistic/indent': [
    'error',
    2,
    {
      flatTernaryExpressions: true,
      SwitchCase: 0,
      offsetTernaryExpressions: false,
      ignoreComments: false,
      tabLength: 4,
    },
  ],
  '@stylistic/semi': ['warn', 'always'],
  '@stylistic/quote-props': ['error', 'as-needed'],
  '@stylistic/arrow-parens': ['error', 'always'],
  // Pins below preserve the pre-eslint-9 formatting: airbnb-extended ports
  // airbnb's formatting rules to @stylistic, and where @stylistic v5's
  // recommended preset no longer overrides them, airbnb's values would
  // otherwise win and flag the committed style.
  '@stylistic/yield-star-spacing': ['error', 'both'],
  '@stylistic/comma-dangle': [
    'error',
    {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
      enums: 'always-multiline',
      generics: 'always-multiline',
      tuples: 'always-multiline',
    },
  ],
  '@stylistic/brace-style': [
    'error',
    '1tbs',
    {
      allowSingleLine: true,
    },
  ],
  '@stylistic/operator-linebreak': ['error', 'before'],
  '@stylistic/quotes': [
    'error',
    'single',
    {
      avoidEscape: true,
    },
  ],
  // Detects renamed default imports by guessing the source's export name;
  // misfires on webpack config chains and did not exist before import-x.
  'import-x/no-rename-default': 'off',
};
