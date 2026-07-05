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
            // Type checking is done by fork-ts-checker in tsbaseConfig;
            // the loader only transpiles.
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
});
