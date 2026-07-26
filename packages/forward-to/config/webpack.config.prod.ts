import umdLibConfig from '@userscript/webpack-config/umdLibConfig';
import type {
  Configuration,
} from 'webpack';
import {
  BundleAnalyzerPlugin,
} from 'webpack-bundle-analyzer';
import {
  merge,
} from 'webpack-merge';

import webpackConfigBase from './webpack.config.base.ts';

export default merge<Configuration>(
  webpackConfigBase,
  umdLibConfig('forwardTo'),
  {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    ],
  },
);
