export default interface Setter<V, S> {
  (value: V): <T extends S>(state: T) => S
}

