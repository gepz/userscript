import fs from 'fs';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
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
    externals: {
      sweetalert2: 'Swal',
      rxjs: 'rxjs',
      loglevel: 'log',
      mithril: 'm',
    },
    plugins: [userscriptPlugin(false)],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: false,
            format: {
              comments: false,
              ecma: 2015,
              semicolons: false,
              preamble: fs.readFileSync(
                path.join(process.cwd(), 'config/userscript_header.js'),
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
