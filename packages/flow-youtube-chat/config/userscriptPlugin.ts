import cdnFromDependency from '@userscript/cdn-from-dependency';
import WebpackUserscript, {
  RunAtValue,
} from 'webpack-userscript';

import {
  dependencies,
} from '../package.json';

const cdnSegment = cdnFromDependency.bind(undefined, dependencies);

export default (devMode: boolean): WebpackUserscript => new WebpackUserscript({
  strict: false,
  headers: (headers, ctx) => ({
    name: 'Flow Youtube Chat',
    namespace: 'FlowYoutubeChatScript',
    version: `${
      headers.version ?? ''
    }${devMode ? `+${ctx.buildTime.getTime()}` : ''}`,
    'run-at': RunAtValue.DocumentEnd,
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
    // eslint-disable-next-line max-len
    description: 'Youtubeのチャットをニコニコ風に画面上へ流す(再アップ) Make youtube chats move in danmaku-style.',
    ...devMode ? {}
    : {
      require: [
        (x = cdnSegment('sweetalert2')) => `${x.begin}cdn.jsdelivr.net/npm/${
          x.nameVer}/dist/${x.name}.all${x.end}`,
        (x = cdnSegment('loglevel')) => `${x.begin}unpkg.com/${
          x.nameVer}/dist/${x.name}${x.end}`,
        (x = cdnSegment('rxjs')) => `${x.begin}unpkg.com/${
          x.nameVer}/dist/bundles/${x.name}.umd${x.end}`,
        (x = cdnSegment('mithril')) => `${x.begin}unpkg.com/${
          x.nameVer}/${x.name}${x.end}`,
        (x = cdnSegment('deep-diff')) => `${x.begin}cdn.jsdelivr.net/npm/${
          x.nameVer}/index${x.end}`,
        (x = cdnSegment('astring')) => `${x.begin}cdn.jsdelivr.net/npm/${
          x.nameVer}/dist/${x.name}${x.end}`,
        (x = cdnSegment('jsep')) => `${x.begin}cdn.jsdelivr.net/npm/${
          x.nameVer}/dist/iife/${x.name}.iife${x.end}`,
        (x = cdnSegment('hash-it')) => `${x.begin}cdn.jsdelivr.net/npm/${
          x.nameVer}/dist/min/index.js`,
        (x = cdnSegment('micro-memoize')) => `${x.begin}cdn.jsdelivr.net/npm/${
          x.nameVer}/dist/${x.name}${x.end}`,
        (x = cdnSegment('lz-string')) => `${x.begin}cdn.jsdelivr.net/npm/${
          x.nameVer}/libs/${x.name}${x.end}`,
      ].map((x) => x()),
    },
  }),
  ssri: {
    algorithms: ['sha384'],
  },
});
