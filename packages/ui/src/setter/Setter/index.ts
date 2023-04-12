export default interface Setter<V, S> {
  (value: V): (state: S) => S
}
