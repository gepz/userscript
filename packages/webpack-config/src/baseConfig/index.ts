import path from 'path';
import {
  Configuration,
} from 'webpack';

// rootDir is the package directory, passed explicitly (call sites derive it
// from import.meta.dirname). A process.cwd() default would silently
// mis-point the @ alias whenever a config is loaded by a process not
// started in the package directory, as editor tooling does.
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
