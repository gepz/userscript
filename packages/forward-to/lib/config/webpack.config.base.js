"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsbaseConfig_1 = require("@userscript/webpack-config/tsbaseConfig");
// import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
var path_1 = require("path");
var webpack_merge_1 = require("webpack-merge");
exports.default = (0, webpack_merge_1.merge)((0, tsbaseConfig_1.default)(path_1.default.resolve(__dirname, '../'), true), {
    plugins: [
    // new ForkTsCheckerWebpackPlugin({
    //   typescript: {
    //     build: true,
    //     mode: 'write-dts',
    //   },
    // }),
    ],
    stats: {
        errorDetails: true,
    },
});
