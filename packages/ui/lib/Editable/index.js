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
exports.hasError = exports.setText = exports.setValue = exports.error = exports.text = exports.value = exports.fromValueText = exports.of = void 0;
const Function_1 = require("@effect/data/Function");
const O = __importStar(require("@effect/data/Option"));
const Tu = __importStar(require("@effect/data/Tuple"));
const of = (x) => [x, O.none()];
exports.of = of;
const fromValueText = (v) => (t) => [v, O.some([t, O.none()])];
exports.fromValueText = fromValueText;
exports.value = Tu.getFirst;
const text = (x) => (0, Function_1.pipe)(Tu.getSecond(x), O.map(Tu.getFirst));
exports.text = text;
const error = (x) => (0, Function_1.pipe)(Tu.getSecond(x), O.flatMap(Tu.getSecond));
exports.error = error;
const setValue = (v) => (0, Function_1.pipe)((0, Function_1.constant)(v), (x) => Tu.mapFirst(x));
exports.setValue = setValue;
const setText = (x) => Tu.mapSecond((snd) => snd.pipe(O.map(Tu.mapFirst((0, Function_1.constant)(x))), O.orElse((0, Function_1.constant)(O.some([x, O.none()])))));
exports.setText = setText;
const hasError = (x) => O.isSome((0, exports.error)(x));
exports.hasError = hasError;
//# sourceMappingURL=index.js.map