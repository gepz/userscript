import path from 'path';
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

export default (rootDir: string): Configuration => ({
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(rootDir, 'dist'),
    },
    compress: false,
  },
});
