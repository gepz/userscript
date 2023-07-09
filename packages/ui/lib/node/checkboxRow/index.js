"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hyperapp_1 = require("hyperapp");
exports.default = (label, checked, onchange) => (0, hyperapp_1.h)('div', {}, (0, hyperapp_1.h)('label', {}, [
    (0, hyperapp_1.text)(label),
    (0, hyperapp_1.h)('input', {
        type: 'checkbox',
        checked,
        onchange,
    }),
]));
//# sourceMappingURL=index.js.map