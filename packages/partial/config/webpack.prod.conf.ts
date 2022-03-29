import libConfig from '@userscript/webpack-config/libConfig';
import {
  merge,
} from 'webpack-merge';

import baseConfig from './webpack.base.conf';

export default merge(
  baseConfig(),
  libConfig('partial'),
);
