"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EditAction_1 = __importDefault(require("../../EditAction"));
const Editable_1 = __importDefault(require("../../Editable"));
const ExactTypeKey_1 = __importDefault(require("../../ExactTypeKey"));
const AppTextGetter_1 = __importDefault(require("../AppTextGetter"));
const errorText_1 = __importDefault(require("../../errorText"));
const rangeRow_1 = __importDefault(require("../../node/rangeRow"));
const settingRow_1 = __importDefault(require("../../node/settingRow"));
const EditSetter_1 = __importDefault(require("../../setter/EditSetter"));
exports.default = (setter) => (editAction, getText, getState) => (label, min, max, step) => (c) => (s) => (0, settingRow_1.default)(getText(label)(s), (0, errorText_1.default)(getText('inputNonNumberic')(s))(getState(label)(s)), [
    (0, rangeRow_1.default)({
        min,
        max,
        step,
    }, 
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    editAction(label, setter)(c))(getState(label)(s)),
]);
//# sourceMappingURL=index.js.map