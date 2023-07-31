"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Function_1 = require("effect/Function");
const O = __importStar(require("effect/Option"));
const RA = __importStar(require("effect/ReadonlyArray"));
const hyperapp_1 = require("hyperapp");
exports.default = (style) => (ontabSelect) => (labels) => (tabs) => (mainTab) => (0, hyperapp_1.h)('div', {
    style: style.container,
}, [
    (0, hyperapp_1.h)('div', {}, (0, Function_1.pipe)(labels, RA.map((x, i) => (0, hyperapp_1.h)('span', {
        style: {
            ...style.label,
            ...(mainTab === i ? style.labelFocus : {}),
            display: 'inline-block',
        },
        onpointerdown: [ontabSelect, i],
    }, (0, hyperapp_1.text)(x))))),
    (0, hyperapp_1.h)('div', {
        style: {
            ...style.tab,
            overflow: 'auto',
            boxSizing: 'border-box',
        },
    }, (0, Function_1.pipe)(tabs, RA.get(mainTab), O.match({
        onNone: () => undefined,
        onSome: (x) => x(),
    }))),
]);
//# sourceMappingURL=index.js.map