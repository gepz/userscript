export default (e) => {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions, @typescript-eslint/dot-notation
    const target = e.currentTarget ?? e['__target'];
    if (target instanceof HTMLSelectElement
        || target instanceof HTMLTextAreaElement
        || target instanceof HTMLInputElement) {
        return target.value;
    }
    throw Error('Event target type isn\'t acceptable.');
};
//# sourceMappingURL=index.js.map