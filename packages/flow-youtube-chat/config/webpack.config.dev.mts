import devConfig from '@userscript/webpack-config/devConfig';
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
  devConfig(),
  {
    devServer: {
      hot: false,
    },
    devtool: 'eval-source-map',
    plugins: [userscriptPlugin(true)],
  },
);
