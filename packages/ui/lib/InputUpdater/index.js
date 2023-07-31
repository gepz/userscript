"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.make = void 0;
const Function_1 = require("effect/Function");
const StateDispatchable_1 = __importDefault(require("../StateDispatchable"));
const getValue_1 = __importDefault(require("../getValue"));
const make = (getState, updateAt) => (key) => (setter) => (c) => (s, e) => (0, Function_1.pipe)((0, getValue_1.default)(e), setter, (0, Function_1.apply)(getState(key)(s)), updateAt(key), (x) => x(c)(s));
exports.make = make;
//# sourceMappingURL=index.js.map