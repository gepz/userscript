"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BoolUpdater_1 = __importDefault(require("../../BoolUpdater"));
const ExactTypeKey_1 = __importDefault(require("../../ExactTypeKey"));
const AppTextGetter_1 = __importDefault(require("../AppTextGetter"));
const node_1 = require("../../node");
exports.default = (getText, getState, updateBool) => (label) => (c) => (s) => (0, node_1.checkboxRow)(getText(label)(s), getState(label)(s), updateBool(label)(c));
//# sourceMappingURL=index.js.map