"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("@effect/schema/Parser");
const Schema_1 = require("@effect/schema/Schema");
exports.default = (e) => (0, Parser_1.parseSync)((0, Schema_1.instanceOf)(HTMLInputElement))(e.currentTarget).checked;
//# sourceMappingURL=index.js.map