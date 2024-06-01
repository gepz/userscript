export default interface TextGetter<Key, State> {
    (key: Key): (state: State) => string;
}
