export const make = (updateInput) => (key, setter) => (c) => ({
    oninput: updateInput(key)(setter(true))(c),
    onchange: updateInput(key)(setter(false))(c),
});
//# sourceMappingURL=index.js.map