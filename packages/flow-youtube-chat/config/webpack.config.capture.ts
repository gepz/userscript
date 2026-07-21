import path from 'path';
import {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';
import WebpackUserscript, {
  RunAt,
} from 'webpack-userscript';

import webpackConfigBase from './webpack.config.base';

// Dev-only fixture-capture userscript (src/fixtureCapture/main). Unminified
// on purpose: it never ships, and readable output beats size here. The
// object entry replaces (not extends) the base string entry: webpack-merge
// only concatenates same-typed values.
export default merge<Configuration>(
  webpackConfigBase,
  {
    entry: {
      capture: path.join(__dirname, '../src/fixtureCapture/main/index.ts'),
    },
    optimization: {
      minimize: false,
    },
    plugins: [
      new WebpackUserscript({
        headers: {
          name: 'FYC Fixture Capture',
          namespace: 'FlowYoutubeChatScript',
          'run-at': RunAt.DocumentEnd,
          grant: ['GM.xmlHttpRequest'],
          connect: 'localhost',
          match: 'https://www.youtube.com/*',
          noframes: true,
          license: 'AGPL-3.0-or-later',
          description:
            'Dev tool: captures live-chat renderer markup into the'
            + ' flow-youtube-chat parseChat fixtures.',
        },
      }),
    ],
  },
);
