"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.make = void 0;
const Function_1 = require("@effect/data/Function");
const ExactTypeKey_1 = __importDefault(require("../ExactTypeKey"));
const StateDispatchable_1 = __importDefault(require("../StateDispatchable"));
const getChecked_1 = __importDefault(require("../getChecked"));
const make = (updateAt) => (key) => (0, Function_1.flip)((s, e) => (0, Function_1.pipe)(
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
(0, getChecked_1.default)(e), updateAt(key), Function_1.flip, (0, Function_1.apply)(s)));
exports.make = make;
//# sourceMappingURL=index.js.map