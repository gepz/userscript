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
    version: `${
      headers.version ?? ''
    }${devMode ? `+${ctx.buildTime.getTime()}` : ''}`,
    name: 'Iwara Custom Sort',
    'run-at': RunAt.DocumentEnd,
    grant: [
      'GM.setValue',
      'GM.getValue',
      'GM.deleteValue',
      'GM.listValues',
    ],
    match: ['iwara.tv'].flatMap((mainDomain) => [
      'ecchi',
      'www',
    ].flatMap((subDomain) => [
      '',
      's',
    ].map((x) => `http${x}://${subDomain}.${mainDomain}/*`))),
    license: 'AGPL-3.0-or-later',
    description: 'Automatically sort teaser images on '
      + '/videos, /images, /subscriptions, /users, /playlist'
      + ', and sidebars using customizable sort function.'
      + ' Can load and sort multiple pages at once.',
    require: [
      (x = cdnSegment('sweetalert2')) => `${x.begin}cdn.jsdelivr.net/npm/${
        x.nameVer}/dist/${x.name}.all${x.end}`,
      (x = cdnSegment('loglevel')) => `${x.begin}unpkg.com/${
        x.nameVer}/dist/${x.name}${x.end}`,
      (x = cdnSegment('rxjs')) => `${x.begin}unpkg.com/${
        x.nameVer}/dist/bundles/${x.name}.umd${x.end}`,
      (x = cdnSegment('mithril')) => `${x.begin}unpkg.com/${
        x.nameVer}/${x.name}${x.end}`,
    ].map((x) => x()),
    namespace: 'https://greasyfork.org/users/245195',
  }),
  i18n: {
    ja: {
      name: 'Iwara Custom ソート',
      description: '/videos、/images、/subscriptions、/users、/playlist'
        + 'とサイドバーのサムネイルを自動的にソートします。'
        + 'ソート方法はカスタマイズすることができます、'
        + '一度に複数のページを読み込んでソートすることができます。',
    },
  },
  ssri: {
    algorithms: ['sha384'],
  },
});
