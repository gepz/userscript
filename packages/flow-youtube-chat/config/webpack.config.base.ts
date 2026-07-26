import styleLoaderConfig from '@userscript/webpack-config/styleLoaderConfig';
import tsbaseConfig from '@userscript/webpack-config/tsbaseConfig';
import type {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';

export default merge<Configuration>(
  tsbaseConfig(),
  styleLoaderConfig,
  {
    stats: {
      errorDetails: true,
    },
  },
);
