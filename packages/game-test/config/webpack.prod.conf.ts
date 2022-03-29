import fs from 'fs';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import {
  BundleAnalyzerPlugin,
} from 'webpack-bundle-analyzer';
import {
  merge,
} from 'webpack-merge';

import baseConfig from './webpack.base.conf';

module.exports = merge(
  baseConfig(),
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
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: true,
            format: {
              comments: false,
              ecma: 2020,
              semicolons: false,
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
