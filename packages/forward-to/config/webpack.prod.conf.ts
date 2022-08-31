import libConfig from '@userscript/webpack-config/libConfig';
import {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';

import webpackBaseConf from './webpack.base.conf';

export default merge<Configuration>(
  webpackBaseConf,
  libConfig('forwardTo'),
);
