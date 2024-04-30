import {
  Effect as Z,
  Array as A,
  String as Str,
} from 'effect';
import {
  pipe,
} from 'effect/Function';

import UserConfigGetter from '@/UserConfigGetter';
import UserConfigSetter from '@/UserConfigSetter';
import defaultToast from '@/defaultToast';

const template = Z.runPromise(pipe(
  Z.succeed(document.createElement('button')),
  Z.tap((x) => Z.sync(() => x.classList.add(
    'style-scope',
    'yt-icon-button',
    'fyc_button',
  ))),
  Z.tap((x) => Z.sync(() => Object.assign<
  CSSStyleDeclaration,
  Partial<CSSStyleDeclaration>
  >(x.style, {
    padding: '0px',
    width: '20px',
    height: '20px',
    fill: '#fff',
  }))),
  Z.tap((x) => Z.sync(() => x.setAttribute(
    'aria-label',
    'NGに入れる(Ban this user)',
  ))),
  Z.tap((x) => Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    x.innerHTML = '<svg class="style-scope yt-icon" style="width: 100%;'
  + ' height: 75%; fill: var(--yt-spec-text-secondary);" viewBox="0 0 512 512">'
  // eslint-disable-next-line max-len
  + '<path d="M440 78A256 256 0 1 0 73 435 256 256 0 0 0 440 78zm-99 35L113 341C37 179 212 44 341 113zM177 405l228-228c76 162-99 297-228 228z" fill-rule="evenodd"/>'
  + '</svg>';
  })),
));

export default (
  id: string,
) => (
  getConfig: UserConfigGetter,
) => (
  setConfig: UserConfigSetter,
) => (
  chat: HTMLElement,
): Z.Effect<HTMLElement> => pipe(
  getConfig.bannedUsers,
  Z.filterOrFail((x): boolean => !x.includes(id)),
  Z.map((x) => pipe(
    A.dedupeWith(x, Str.Equivalence),
    A.append(id),
  )),
  Z.flatMap((x) => pipe(
    setConfig.bannedUsers(x),
    Z.zipRight(Z.sync(() => defaultToast.fire({
      title: `Added Banned User: ${id}`,
      icon: 'success',
    }))),
  )),
  Z.ignore,
  Z.zipRight(Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    chat.style.display = 'none';
  })),
  (onclick) => pipe(
    Z.promise(() => template),
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    Z.map((x) => x.cloneNode(true) as HTMLElement),
    // eslint-disable-next-line no-param-reassign
    Z.tap((x) => Z.sync(() => { x.onclick = () => Z.runPromise(onclick); })),
  ),
);
