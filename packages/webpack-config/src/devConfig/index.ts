import path from 'path';
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

// See baseConfig for why rootDir defaults to the cwd.
export default (rootDir: string = process.cwd()): Configuration => ({
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(rootDir, 'dist'),
    },
    compress: false,
  },
});
