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
const Function_1 = require("@effect/data/Function");
const O = __importStar(require("@effect/data/Option"));
const Tu = __importStar(require("@effect/data/Tuple"));
const Ed = __importStar(require("../../Editable"));
const EditSetter_1 = __importDefault(require("../EditSetter"));
const setEditInt = (editing) => (value) => (state) => (0, Function_1.pipe)(value, Number.parseInt, editing
    ? (x) => (Number.isNaN(x) || value.at(-1) === '.'
        ? (0, Function_1.pipe)(state, Ed.setText(value)) : Ed.fromValueText(x)(value))
    : (x) => (Number.isNaN(x)
        ? (0, Function_1.pipe)(state, Tu.mapSecond((0, Function_1.constant)(O.some([value, O.some('')])))) : Ed.of(x)));
exports.default = setEditInt;
//# sourceMappingURL=index.js.map