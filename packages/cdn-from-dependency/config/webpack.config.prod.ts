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

import webpackConfigBase from './webpack.config.base';

export default merge<Configuration>(
  webpackConfigBase,
  umdLibConfig('cdnFromDependency'),
  {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    ],
  },
);
