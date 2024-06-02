"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var devConfig_1 = require("@userscript/webpack-config/devConfig");
var path_1 = require("path");
var webpack_merge_1 = require("webpack-merge");
var webpack_config_base_1 = require("./webpack.config.base");
exports.default = (0, webpack_merge_1.merge)(webpack_config_base_1.default, (0, devConfig_1.default)(path_1.default.join(__dirname, '../')));
