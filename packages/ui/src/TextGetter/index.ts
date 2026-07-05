type TextGetter<Key, State> = (key: Key) => (state: State) => string;

export default TextGetter;
