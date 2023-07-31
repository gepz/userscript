"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Function_1 = require("effect/Function");
const hyperapp_1 = require("hyperapp");
exports.default = (action) => (color) => (0, hyperapp_1.h)('input', {
    style: {
        width: '36px',
        verticalAlign: 'middle',
    },
    type: 'color',
    value: color,
    oninput: action.onchange ?? Function_1.identity,
});
//# sourceMappingURL=index.js.map