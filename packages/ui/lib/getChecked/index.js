"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
exports.default = (e) => zod_1.z.instanceof(HTMLInputElement).parse(e.currentTarget).checked;
//# sourceMappingURL=index.js.map