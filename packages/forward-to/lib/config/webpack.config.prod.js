"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var umdLibConfig_1 = require("@userscript/webpack-config/umdLibConfig");
var webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
var webpack_merge_1 = require("webpack-merge");
var webpack_config_base_1 = require("./webpack.config.base");
exports.default = (0, webpack_merge_1.merge)(webpack_config_base_1.default, (0, umdLibConfig_1.default)('forwardTo'), {
    plugins: [
        new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
            analyzerMode: 'static',
        }),
    ],
});
