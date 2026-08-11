import devConfig from '@userscript/webpack-config/devConfig';
import path from 'path';
import type {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';

import webpackConfigBase from './webpack.config.base.mts';

export default merge<Configuration>(
  webpackConfigBase,
  devConfig(path.join(import.meta.dirname, '..')),
);
