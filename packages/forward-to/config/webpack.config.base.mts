import tsbaseConfig from '@userscript/webpack-config/tsbaseConfig';
import type {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';

export default merge<Configuration>(
  tsbaseConfig(),
  {
    stats: {
      errorDetails: true,
    },
  },
);
