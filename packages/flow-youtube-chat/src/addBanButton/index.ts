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

const button = document.createElement('button');
button.classList.add(
  'style-scope',
  'yt-icon-button',
  'fyc_button',
);

Object.assign<
CSSStyleDeclaration,
Partial<CSSStyleDeclaration>
>(button.style, {
  padding: '0px',
  width: '20px',
  height: '20px',
  fill: '#fff',
});

button.setAttribute('aria-label', 'NGに入れる(Ban this user)');
button.innerHTML = '<svg class="style-scope yt-icon" style="width: 100%;'
  + ' height: 75%; fill: var(--yt-spec-text-secondary);" viewBox="0 0 512 512">'
  // eslint-disable-next-line max-len
  + '<path d="M440 78A256 256 0 1 0 73 435 256 256 0 0 0 440 78zm-99 35L113 341C37 179 212 44 341 113zM177 405l228-228c76 162-99 297-228 228z" fill-rule="evenodd"/>'
  + '</svg>';

export default (
  chat: HTMLElement,
  id: string,
  getConfig: UserConfigGetter,
  setConfig: UserConfigSetter,
): IO.IO<void> => (chat.children.namedItem('card') ? () => {}
: () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const clone = button.cloneNode(true) as HTMLButtonElement;
  clone.onclick = pipe(
    getConfig.bannedUsers,
    IOO.fromIO,
    IOO.filter((x) => !x.includes(id)),
    IOO.map(flow(
      RA.uniq(Str.Eq),
      RA.append(id),
    )),
    IOO.chain((x) => IOO.fromIO(() => {
      setConfig.bannedUsers(x);
      defaultToast().fire({
        title: `Added Banned User: ${id}`,
        icon: 'success',
      });
    })),
    IO.apSecond(() => {
      // eslint-disable-next-line no-param-reassign
      chat.style.display = 'none';
    }),
  );

  chat.querySelector('#content #message')?.append(clone);
});
