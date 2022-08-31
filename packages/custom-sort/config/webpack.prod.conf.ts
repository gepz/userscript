import fs from 'fs';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import {
  merge,
} from 'webpack-merge';

import userscriptPlugin from './userscriptPlugin';
import webpackBaseConf from './webpack.base.conf';

module.exports = merge(
  webpackBaseConf,
  {
    externals: {
      sweetalert2: 'Swal',
      rxjs: 'rxjs',
      'feather-icons': 'feather',
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
                path.join(__dirname, './userscript_header.js'),
              ).toString(),
            },
            compress: {
              ecma: 2015,
            },
          },
        }),
      ],
    },
  },
);
