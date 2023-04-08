export default interface EditSetter<T> {
    (editing: boolean): (value: string) => (state: T) => T;
}
//# sourceMappingURL=index.d.ts.map