import path from 'path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import {
  Configuration,
} from 'webpack';
import baseConfig from '../baseConfig';
import tsLoaderConfig from '../tsLoaderConfig';
import {
  merge,
} from 'webpack-merge';

export default (rootDir: string): Configuration => merge(
  baseConfig(rootDir),
  tsLoaderConfig('tsconfig.build.json'),
  {
    resolve: {
      extensions: ['.tsx', '.ts'],
    },
    entry: path.join(rootDir, './src/index.ts'),
    plugins: [
      // Whole-program type checking in a parallel process; ts-loader runs
      // transpile-only. It does not report errors inside dependency
      // declaration files — see "Verification" in docs/architecture.md.
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: path.join(rootDir, 'tsconfig.build.json'),
        },
      }),
    ],
  },
);
