import devConfig from '@userscript/webpack-config/devConfig';
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
  devConfig(),
  {
    devServer: {
      hot: false,
    },
    devtool: 'eval-source-map',
    plugins: [userscriptPlugin(true)],
  },
);
