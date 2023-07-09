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
const P = __importStar(require("@effect/data/Predicate"));
const RA = __importStar(require("@effect/data/ReadonlyArray"));
const Str = __importStar(require("@effect/data/String"));
const Tu = __importStar(require("@effect/data/Tuple"));
const Ed = __importStar(require("../../Editable"));
const EditSetter_1 = __importDefault(require("../EditSetter"));
const setEditRegexes = (editing) => (value) => (0, Function_1.pipe)(value, Str.split(/\r\n|\n/), RA.filter(P.not(Str.isEmpty)), (regexes) => ({
    regexes,
    errors: (0, Function_1.pipe)(regexes, RA.map((x, i) => {
        try {
            RegExp(x, 'u');
            return O.none();
        }
        catch (e) {
            return O.some(
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `${e} in regex number ${i}`);
        }
    }), RA.compact, RA.reduce('', (b, a) => `${b}\n${a}`), O.liftPredicate(Str.isNonEmpty)),
}), (ctx) => (editing ? Ed.setText(value)
    : (0, Function_1.pipe)(ctx.errors, O.map((x) => Tu.mapSecond(() => O.some([value, O.some(x)]))), O.getOrElse(() => () => Ed.of(ctx.regexes)))));
exports.default = setEditRegexes;
//# sourceMappingURL=index.js.map