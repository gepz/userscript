"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hyperapp_1 = require("hyperapp");
exports.default = (label, error, content) => (0, hyperapp_1.h)('div', {}, [
    (0, hyperapp_1.h)('span', {}, (0, hyperapp_1.text)(label)),
    (0, hyperapp_1.h)('span', {
        style: {
            color: '#f55',
            marginLeft: '5px',
            whiteSpace: 'pre-wrap',
        },
    }, (0, hyperapp_1.text)(error)),
    (0, hyperapp_1.h)('div', {}, content),
]);
//# sourceMappingURL=index.js.map