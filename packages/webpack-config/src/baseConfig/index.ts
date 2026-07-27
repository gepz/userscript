import path from 'path';
import {
  Configuration,
} from 'webpack';

// rootDir is the package directory, which pnpm makes the cwd of every script it
// runs. Defaulting it spares every calling config an import.meta.dirname walk
// back out of config/.
export default (rootDir: string = process.cwd()): Configuration => ({
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
