type ComputedProperties<State> = Record<string, (s: State) => unknown>;
export default ComputedProperties;
