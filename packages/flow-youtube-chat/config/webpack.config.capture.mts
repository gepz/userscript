import path from 'path';
import type {
  Configuration,
} from 'webpack';
import {
  merge,
} from 'webpack-merge';
// Named export, not the default -- see userscriptPlugin.mts.
import {
  RunAt,
  UserscriptPlugin,
} from 'webpack-userscript';

// Node's ESM loader hands back only a default export for JSON, and only
// with the type attribute.
import packageJson from '../package.json' with {
  type: 'json'
};

import webpackConfigBase from './webpack.config.base.mts';

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
          // Per-build version: managers skip same-version installs, so a
          // rebuilt dev script would silently never replace the running
          // copy without this.
          version: `${packageJson.version}.${Math.floor(Date.now() / 1000)}`,
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
