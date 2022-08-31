import tsbaseConfig from '@userscript/webpack-config/tsbaseConfig';
import path from 'path';
import {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';

export default merge<Configuration>(
  tsbaseConfig(path.resolve(__dirname, '../')),
);
