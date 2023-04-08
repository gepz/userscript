import assert from '@userscript/assert';
export default (constructor) => (x) => {
    assert(x instanceof constructor);
    return x;
};
//# sourceMappingURL=index.js.map