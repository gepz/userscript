const Primitive = {
  number: 'number',
  boolean: 'boolean',
  string: 'string',
} as const;

type Primitive = (typeof Primitive)[keyof typeof Primitive];

export default Primitive;
