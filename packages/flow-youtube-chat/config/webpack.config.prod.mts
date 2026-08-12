import fs from 'fs';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import type {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';

import userscriptPlugin from './userscriptPlugin.mts';
import webpackConfigBase from './webpack.config.base.mts';

export default merge<Configuration>(
  webpackConfigBase,
  {
    // micro-memoize is deliberately absent — see "micro-memoize is bundled,
    // not CDN-required" in docs/decisions.md.
    externals: [
      {
        astring: 'astring',
        jsep: 'jsep',
        'hash-it': 'window[\'hash-it\']',
        'lz-string': 'LZString',
      },
    ],
    plugins: [userscriptPlugin(false)],
    optimization: {
      usedExports: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: false,
            format: {
              comments: false,
              ecma: 2020,
              semicolons: true,
              preamble: fs.readFileSync(
                path.join(import.meta.dirname, 'userscript_header.js'),
              ).toString(),
            },
            compress: {
              defaults: true,
              ecma: 2020,
              sequences: false,
              toplevel: true,
              passes: 3,
            },
          },
        }),
      ],
    },
  },
);
