import devConfig from '@userscript/webpack-config/devConfig';
import path from 'path';
import {
  merge,
} from 'webpack-merge';

import userscriptPlugin from './userscriptPlugin';
import baseConfig from './webpack.base.conf';

export default merge(
  baseConfig(),
  devConfig(path.join(__dirname, '../')),
  {
    plugins: [userscriptPlugin(true)],
  },
);
