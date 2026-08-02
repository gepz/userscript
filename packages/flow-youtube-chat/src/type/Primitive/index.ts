const Primitive = {
  number: 0,
  boolean: 1,
  string: 2,
} as const;

type Primitive = (typeof Primitive)[keyof typeof Primitive];

export default Primitive;
