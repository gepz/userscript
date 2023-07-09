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
const Function_1 = require("@effect/data/Function");
const O = __importStar(require("@effect/data/Option"));
const RA = __importStar(require("@effect/data/ReadonlyArray"));
const hyperapp_1 = require("hyperapp");
const Ed = __importStar(require("../../Editable"));
exports.default = (rows, action) => (value) => (0, hyperapp_1.h)('textarea', {
    rows,
    style: {
        resize: 'none',
        boxSizing: 'border-box',
        width: '100%',
        borderColor: Ed.hasError(value) ? '#f55' : undefined,
    },
    value: (0, Function_1.pipe)(value, Ed.text, O.getOrElse((0, Function_1.pipe)(Ed.value(value), RA.join('\n'), Function_1.constant))),
    ...action,
});
//# sourceMappingURL=index.js.map