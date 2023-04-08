import fs from 'fs';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import {
  merge,
} from 'webpack-merge';

import userscriptPlugin from './userscriptPlugin';
import webpackBaseConf from './webpack.base.conf';

export default merge(
  webpackBaseConf,
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
