import cdnFromDependency from '@userscript/cdn-from-dependency';
// The named export, not the default: webpack-userscript is CommonJS, and
// Node's ESM interop hands back module.exports itself rather than
// honouring the __esModule default marker.
import {
  RunAt,
  UserscriptPlugin,
} from 'webpack-userscript';

// Node's ESM loader hands back only a default export for JSON, and only
// with the type attribute.
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
        // (x = cdnSegment('sweetalert2')) => `${x.begin}cdn.jsdelivr.net/npm/${
        //   x.nameVer}/dist/${x.name}.js`,
        // x.nameVer}/dist/${x.name}${x.end}`,
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
