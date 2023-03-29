import devConfig from '@userscript/webpack-config/devConfig';
import path from 'path';
import {
  merge,
} from 'webpack-merge';

import userscriptPlugin from './userscriptPlugin';
import webpackBaseConf from './webpack.base.conf';

export default merge(
  webpackBaseConf,
  devConfig(path.join(__dirname, '../')),
  {
    devServer: {
      hot: false,
    },
    devtool: 'eval-source-map',
    plugins: [userscriptPlugin(true)],
  },
);
