import devConfig from '@userscript/webpack-config/devConfig';
import path from 'path';
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
  devConfig(path.join(import.meta.dirname, '..')),
  {
    devServer: {
      hot: false,
    },
    devtool: 'eval-source-map',
    plugins: [userscriptPlugin(true)],
  },
);
