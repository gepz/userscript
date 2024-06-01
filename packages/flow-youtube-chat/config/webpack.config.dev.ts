import devConfig from '@userscript/webpack-config/devConfig';
import path from 'path';
import {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';

import userscriptPlugin from './userscriptPlugin';
import webpackConfigBase from './webpack.config.base';

export default merge<Configuration>(
  webpackConfigBase,
  devConfig(path.join(__dirname, '../')),
  {
    devServer: {
      hot: false,
    },
    devtool: 'eval-source-map',
    plugins: [userscriptPlugin(true)],
  },
);
