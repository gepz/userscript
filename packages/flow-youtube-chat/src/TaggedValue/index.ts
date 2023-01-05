type TaggedValue<T1 extends string, T2> = {
  tag: T1,
  value: T2,
};

export default TaggedValue;

export const makeType = <A extends TaggedValue<string, unknown>>(
  tag: A['tag'],
) => (
  value: A['value'],
): TaggedValue<A['tag'], A['value']> => ({
  tag,
  value,
});
