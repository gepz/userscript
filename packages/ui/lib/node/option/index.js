"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hyperapp_1 = require("hyperapp");
exports.default = (value, label, selected) => (0, hyperapp_1.h)('option', {
    value,
    selected,
}, (0, hyperapp_1.text)(label));
//# sourceMappingURL=index.js.map