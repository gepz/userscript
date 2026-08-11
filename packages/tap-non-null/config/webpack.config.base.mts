import tsbaseConfig from '@userscript/webpack-config/tsbaseConfig';
import path from 'path';
import type {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';

export default merge<Configuration>(
  tsbaseConfig(path.join(import.meta.dirname, '..')),
  {
    stats: {
      errorDetails: true,
    },
  },
);
