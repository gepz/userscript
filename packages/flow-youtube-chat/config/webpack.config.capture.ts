import path from 'path';
import type {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';
// Named export, not the default -- see userscriptPlugin.ts.
import {
  RunAt,
  UserscriptPlugin,
} from 'webpack-userscript';

import webpackConfigBase from './webpack.config.base.ts';

// Dev-only fixture-capture userscript (src/fixtureCapture/main). Unminified
// on purpose: it never ships, and readable output beats size here. The
// object entry replaces (not extends) the base string entry: webpack-merge
// only concatenates same-typed values.
export default merge<Configuration>(
  webpackConfigBase,
  {
    entry: {
      capture: path.join(process.cwd(), 'src/fixtureCapture/main/index.ts'),
    },
    optimization: {
      minimize: false,
    },
    plugins: [
      new UserscriptPlugin({
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
