import * as IO from 'fp-ts/IO';
import * as IOO from 'fp-ts/IOOption';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
  flow,
} from 'fp-ts/function';
import * as Str from 'fp-ts/string';

import UserConfigGetter from '@/UserConfigGetter';
import UserConfigSetter from '@/UserConfigSetter';
import defaultToast from '@/defaultToast';

const template = pipe(
  document.createElement('button'),
  IO.of,
  IO.chainFirst((x) => () => x.classList.add(
    'style-scope',
    'yt-icon-button',
    'fyc_button',
  )),
  IO.chainFirst((x) => () => Object.assign<
  CSSStyleDeclaration,
  Partial<CSSStyleDeclaration>
  >(x.style, {
    padding: '0px',
    width: '20px',
    height: '20px',
    fill: '#fff',
  })),
  IO.chainFirst((x) => () => x.setAttribute(
    'aria-label',
    'NGに入れる(Ban this user)',
  )),
  IO.chainFirst((x) => () => {
    // eslint-disable-next-line no-param-reassign
    x.innerHTML = '<svg class="style-scope yt-icon" style="width: 100%;'
  + ' height: 75%; fill: var(--yt-spec-text-secondary);" viewBox="0 0 512 512">'
  // eslint-disable-next-line max-len
  + '<path d="M440 78A256 256 0 1 0 73 435 256 256 0 0 0 440 78zm-99 35L113 341C37 179 212 44 341 113zM177 405l228-228c76 162-99 297-228 228z" fill-rule="evenodd"/>'
  + '</svg>';
  }),
)();

export default (
  id: string,
) => (
  getConfig: UserConfigGetter,
) => (
  setConfig: UserConfigSetter,
) => (
  chat: HTMLElement,
): IO.IO<HTMLElement> => pipe(
  getConfig.bannedUsers,
  IOO.fromIO,
  IOO.filter((x) => !x.includes(id)),
  IOO.map(flow(
    RA.uniq(Str.Eq),
    RA.append(id),
  )),
  IOO.chainIOK((x) => pipe(
    setConfig.bannedUsers(x),
    IO.apSecond(() => defaultToast.fire({
      title: `Added Banned User: ${id}`,
      icon: 'success',
    })),
  )),
  IO.apSecond(() => {
    // eslint-disable-next-line no-param-reassign
    chat.style.display = 'none';
  }),
  (onclick) => pipe(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    () => template.cloneNode(true) as HTMLElement,
    // eslint-disable-next-line no-param-reassign
    IO.chainFirst((x) => () => { x.onclick = onclick; }),
  ),
);
