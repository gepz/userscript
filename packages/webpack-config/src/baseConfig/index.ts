import path from 'path';
import {
  Configuration,
} from 'webpack';

export default (rootDir: string): Configuration => ({
  mode: 'production',
  resolve: {
    extensions: ['.jsx', '.js'],
    alias: {
      '@': path.resolve(rootDir, 'src/'),
    },
  },
  output: {
    filename: '[name]/index.js',
    publicPath: '',
  },
});
