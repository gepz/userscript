import fs from 'fs';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import {
  BundleAnalyzerPlugin,
} from 'webpack-bundle-analyzer';
import {
  merge,
} from 'webpack-merge';

import userscriptPlugin from './userscriptPlugin';
import webpackBaseConf from './webpack.base.conf';

module.exports = merge(
  webpackBaseConf,
  {
    externals: [
      {
        sweetalert2: 'Swal',
        rxjs: 'rxjs',
        'feather-icons': 'feather',
        loglevel: 'log',
        mithril: 'm',
        'check-types': 'check',
        'deep-diff': 'DeepDiff',
        astring: 'astring',
        jsep: 'jsep',
        'hash-it': 'window[\'hash-it\']',
        'micro-memoize': 'window[\'micro-memoize\']',
      },
    ],
    plugins: [
      // new BundleAnalyzerPlugin({
      // analyzerMode: 'static',
      // }),
      userscriptPlugin(false),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: false,
            format: {
              comments: false,
              ecma: 2020,
              semicolons: false,
              preamble: fs.readFileSync(
                path.join(__dirname, './userscript_header.js'),
              ).toString(),
            },
            compress: {
              ecma: 2020,
              sequences: false,
              toplevel: true,
              passes: 2,
            },
          },
        }),
      ],
    },
  },
);
