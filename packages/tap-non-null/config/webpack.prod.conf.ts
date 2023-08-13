import umdLibConfig from '@userscript/webpack-config/umdLibConfig';
import {
  Configuration,
} from 'webpack';
import {
  BundleAnalyzerPlugin,
} from 'webpack-bundle-analyzer';
import {
  merge,
} from 'webpack-merge';

import webpackBaseConf from './webpack.base.conf';

export default merge<Configuration>(
  webpackBaseConf,
  umdLibConfig('tapNonNull'),
  {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    ],
  },
);
