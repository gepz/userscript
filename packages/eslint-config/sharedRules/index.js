module.exports = {
  'padding-line-between-statements': [
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
  'import/order': [
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
  'no-param-reassign': [
    'error',
  ],
  'no-mixed-operators': [
    'error', {
      allowSamePrecedence: true,
    },
  ],
  'object-curly-newline': [
    'error', {
      multiline: true,
      minProperties: 1,
    },
  ],
  'max-len': [
    'error', {
      code: 80,
    },
  ],
  'function-paren-newline': ['error', 'multiline-arguments'],
  'object-property-newline': [
    'error',
    {
      allowAllPropertiesOnSameLine: false,
    },
  ],
  'array-element-newline': ['error', 'consistent'],
  'array-bracket-newline': [
    'error', {
      multiline: true,
    },
  ],
  'no-nested-ternary': ['off'],
  'max-params': ['error', 6],
  'max-statements-per-line': ['error'],
};
