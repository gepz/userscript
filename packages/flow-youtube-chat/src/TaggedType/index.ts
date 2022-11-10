type TaggedType<T1 extends string, T2> = {
  tag: T1,
  type: T2,
};

export default TaggedType;

export const makeType = <A extends TaggedType<string, unknown>>(
  tag: A['tag'],
) => (
  type: A['type'],
) => ({
  tag,
  type,
});
