import devConfig from '@userscript/webpack-config/devConfig';
import path from 'path';
import {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';

import webpackBaseConf from './webpack.base.conf';

export default merge<Configuration>(
  webpackBaseConf,
  devConfig(path.join(__dirname, '../')),
);
