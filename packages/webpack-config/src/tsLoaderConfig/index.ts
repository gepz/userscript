import {
  Configuration,
} from 'webpack';

export default (configFile: string): Configuration => ({
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: { 
            configFile,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
});
