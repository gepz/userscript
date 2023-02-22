import cdnFromDependency from '@userscript/cdn-from-dependency';
import WebpackUserscript, {
  RunAtValue,
} from 'webpack-userscript';

import {
  dependencies,
} from '../package.json';

const cdnSegment = cdnFromDependency.bind(undefined, dependencies);

export default (devMode: boolean): WebpackUserscript => new WebpackUserscript({
  headers: (data) => ({
    version: `${
      data.headers.version ?? ''
    }${devMode ? `.${Date.now()}` : ''}`,
    name: 'Iwara Custom Sort',
    'name:ja': 'Iwara Custom ソート',
    'run-at': RunAtValue.DocumentEnd,
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
    'description:ja': '/videos、/images、/subscriptions、/users、/playlist'
      + 'とサイドバーのサムネイルを自動的にソートします。'
      + 'ソート方法はカスタマイズすることができます、'
      + '一度に複数のページを読み込んでソートすることができます。',
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
  ssri: {
    algorithms: ['sha384'],
  },
});
