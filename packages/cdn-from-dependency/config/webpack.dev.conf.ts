import devConfig from '@userscript/webpack-config/devConfig';
import path from 'path';
import {
  merge,
} from 'webpack-merge';

import webpackBaseConf from './webpack.base.conf';

export default merge(
  webpackBaseConf(),
  devConfig(path.join(__dirname, '../')),
);
