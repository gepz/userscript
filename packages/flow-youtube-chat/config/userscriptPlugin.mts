import cdnFromDependency from '@userscript/cdn-from-dependency';
// Named export, not the default — see the webpack-configs section of
// docs/decisions.md.
import {
  RunAt,
  UserscriptPlugin,
} from 'webpack-userscript';

import packageJson from '../package.json' with {
  type: 'json'
};

const cdnSegment = cdnFromDependency.bind(undefined, packageJson.dependencies);

export default (devMode: boolean): UserscriptPlugin => new UserscriptPlugin({
  headers: (headers, ctx) => ({
    name: 'Flow Youtube Chat',
    namespace: 'FlowYoutubeChatScript',
    version: `${
      headers.version ?? ''
    }${devMode ? `+${ctx.buildTime.getTime()}` : ''}`,
    'run-at': RunAt.DocumentEnd,
    grant: [
      'GM.setValue',
      'GM.getValue',
      'GM.deleteValue',
      'GM.listValues',
      'GM.setClipboard',
    ],
    match: 'https://www.youtube.com/*',
    noframes: true,
    license: 'AGPL-3.0-or-later',
    // eslint-disable-next-line @stylistic/max-len
    description: 'Youtubeのチャットをニコニコ風に画面上へ流す(再アップ) Make youtube chats move in danmaku-style.',
    ...devMode
      ? {}
      : {
        require: [
          (x = cdnSegment('astring')) => `${x.begin}cdn.jsdelivr.net/npm/${
            x.nameVer}/dist/${x.name}${x.end}`,
          (x = cdnSegment('jsep')) => `${x.begin}cdn.jsdelivr.net/npm/${
            x.nameVer}/dist/iife/${x.name}.iife${x.end}`,
          (x = cdnSegment('hash-it')) => `${x.begin}cdn.jsdelivr.net/npm/${
            x.nameVer}/dist/umd/index.js`,
          (x = cdnSegment('lz-string')) => `${x.begin}cdn.jsdelivr.net/npm/${
            x.nameVer}/libs/${x.name}${x.end}`,
        ].map((x) => x()),
      },
  }),
  ssri: {
    algorithms: ['sha384'],
  },
});
