import type {
  Configuration,
} from 'webpack';
import {
  BundleAnalyzerPlugin,
} from 'webpack-bundle-analyzer';
import {
  merge,
} from 'webpack-merge';

import webpackConfigProd from './webpack.config.prod.ts';

// The production build plus a bundle-composition report. "Parsed" sizes
// are the post-minify bytes actually shipped — the plain stats module
// sizes are pre-tree-shake and wildly overstate (fast-check shows up
// there but ships zero bytes).
export default merge<Configuration>(webpackConfigProd, {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,
    }),
  ],
});
