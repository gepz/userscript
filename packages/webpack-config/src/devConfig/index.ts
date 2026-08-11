import path from 'path';
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

// See baseConfig for why rootDir must be explicit.
export default (rootDir: string): Configuration => ({
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(rootDir, 'dist'),
    },
    compress: false,
  },
});
