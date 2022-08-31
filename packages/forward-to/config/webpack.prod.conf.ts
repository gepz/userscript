import libConfig from '@userscript/webpack-config/libConfig';
import {
  merge,
} from 'webpack-merge';

import webpackBaseConf from './webpack.base.conf';

export default merge(
  webpackBaseConf(),
  libConfig('forwardTo'),
);
