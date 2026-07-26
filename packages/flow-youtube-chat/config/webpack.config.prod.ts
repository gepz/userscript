import fs from 'fs';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
// import {
//   BundleAnalyzerPlugin,
// } from 'webpack-bundle-analyzer';
import type {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';

import userscriptPlugin from './userscriptPlugin.ts';
import webpackConfigBase from './webpack.config.base.ts';

export default merge<Configuration>(
  webpackConfigBase,
  {
    externals: [
      {
        // sweetalert2: 'Swal',
        astring: 'astring',
        jsep: 'jsep',
        'hash-it': 'window[\'hash-it\']',
        // micro-memoize is bundled: its v5 UMD build expects fast-equals and
        // fast-stringify as globals under names their own UMD builds don't
        // register, so it cannot work as a CDN require.
        'lz-string': 'LZString',
      },
    ],
    plugins: [
      // new BundleAnalyzerPlugin({
      //   analyzerMode: 'static',
      // }),
      userscriptPlugin(false),
    ],
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
                path.join(process.cwd(), 'config/userscript_header.js'),
              ).toString(),
            },
            compress: {
              defaults: true,
              ecma: 2020,
              sequences: false,
              toplevel: true,
              passes: 3,
              // unused: false,
            },
          },
        }),
      ],
    },
  },
);
