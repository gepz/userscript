import umdLibConfig from '@userscript/webpack-config/umdLibConfig';
import {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';

import webpackBaseConf from './webpack.base.conf';

export default merge<Configuration>(
  webpackBaseConf,
  umdLibConfig('forwardTo'),
);
