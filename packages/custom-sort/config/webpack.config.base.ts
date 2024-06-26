import styleLoaderConfig from '@userscript/webpack-config/styleLoaderConfig';
import tsbaseConfig from '@userscript/webpack-config/tsbaseConfig';
// import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';
import {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';

export default merge<Configuration>(
  tsbaseConfig(path.join(__dirname, '../')),
  styleLoaderConfig,
  {
    plugins: [
      // new ForkTsCheckerWebpackPlugin({
      //   typescript: {
      //     build: true,
      //     mode: 'write-dts',
      //   },
      // }),
    ],
    stats: {
      errorDetails: true,
    },
  },
);
