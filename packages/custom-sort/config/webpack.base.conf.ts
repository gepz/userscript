import styleLoaderConfig from '@userscript/webpack-config/styleLoaderConfig';
import tsbaseConfig from '@userscript/webpack-config/tsbaseConfig';
import path from 'path';
import {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';

export default (): Configuration => merge(
  tsbaseConfig(path.join(__dirname, '../')),
  styleLoaderConfig(),
);
