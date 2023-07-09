"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hyperapp_1 = require("hyperapp");
exports.default = (action) => (color) => (0, hyperapp_1.h)('input', {
    style: {
        width: '36px',
        verticalAlign: 'middle',
    },
    type: 'color',
    value: color,
    oninput: action.onchange,
});
//# sourceMappingURL=index.js.map