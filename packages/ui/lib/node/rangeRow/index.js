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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Function_1 = require("effect/Function");
const O = __importStar(require("effect/Option"));
const hyperapp_1 = require("hyperapp");
const Ed = __importStar(require("../../Editable"));
const RangeConfig_1 = __importDefault(require("../RangeConfig"));
exports.default = (config, action) => (value) => (0, hyperapp_1.h)('div', {}, [
    (0, hyperapp_1.h)('input', {
        style: {
            width: '150px',
            verticalAlign: 'middle',
        },
        type: 'range',
        ...config,
        value: Ed.value(value).toString(),
        oninput: action.onchange ?? Function_1.identity,
    }),
    (0, hyperapp_1.h)('input', {
        style: {
            width: '30px',
            backgroundColor: 'transparent',
            color: 'inherit',
            borderWidth: '1px',
            verticalAlign: 'middle',
            borderColor: Ed.hasError(value) ? '#f55' : null,
        },
        inputmode: 'decimal',
        value: (0, Function_1.pipe)(value, Ed.text, O.getOrElse((0, Function_1.constant)(Ed.value(value).toFixed(4).replace(/\.?0+$/, '')))),
        ...action,
    }),
]);
//# sourceMappingURL=index.js.map