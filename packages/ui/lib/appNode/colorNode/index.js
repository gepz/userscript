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
const EditAction_1 = __importDefault(require("../../EditAction"));
const Ed = __importStar(require("../../Editable"));
const ExactTypeKey_1 = __importDefault(require("../../ExactTypeKey"));
const AppTextGetter_1 = __importDefault(require("../AppTextGetter"));
const errorText_1 = __importDefault(require("../../errorText"));
const node_1 = require("../../node");
const settingRow_1 = __importDefault(require("../../node/settingRow"));
const setter_1 = require("../../setter");
const EditSetter_1 = __importDefault(require("../../setter/EditSetter"));
exports.default = (editAction, getText, getState) => (label) => (c) => (s) => (0, settingRow_1.default)(getText(label)(s), (0, errorText_1.default)(getText('invalidColor')(s))(getState(label)(s)), (0, Function_1.pipe)(
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
editAction(label, setter_1.setEditColor)(c), (x) => [
    (0, node_1.colorPicker)(x)(Ed.value(getState(label)(s))),
    (0, node_1.textInput)(x)(getState(label)(s)),
]));
//# sourceMappingURL=index.js.map