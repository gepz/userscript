"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.make = void 0;
const InputUpdater_1 = __importDefault(require("../InputUpdater"));
const StateDispatchable_1 = __importDefault(require("../StateDispatchable"));
const EditSetter_1 = __importDefault(require("../setter/EditSetter"));
const make = (updateInput) => (key, setter) => (c) => ({
    oninput: updateInput(key)(setter(true))(c),
    onchange: updateInput(key)(setter(false))(c),
});
exports.make = make;
//# sourceMappingURL=index.js.map