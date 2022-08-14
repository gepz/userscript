export default interface TaggedType<T1 extends string, T2> {
  tag: T1,
  type: T2,
}
