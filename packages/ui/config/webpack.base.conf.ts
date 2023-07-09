import tsbaseConfig from '@userscript/webpack-config/tsbaseConfig';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';

export default merge(
  tsbaseConfig(path.resolve(__dirname, '../')),
  {
    plugins: [new ForkTsCheckerWebpackPlugin()],
    stats: {
      errorDetails: true,
    },
  },
) satisfies Configuration;
