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
import banButton from '@/banButton';
import defaultToast from '@/defaultToast';

export default (
  chat: HTMLElement,
  id: string,
  getConfig: UserConfigGetter,
  setConfig: UserConfigSetter,
): IO.IO<void> => (chat.children.namedItem('card') ? () => {}
: pipe(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  () => banButton.cloneNode(true) as HTMLButtonElement,
  IO.chainFirst((clone) => pipe(
    getConfig.bannedUsers,
    IOO.fromIO,
    IOO.filter((x) => !x.includes(id)),
    IOO.map(flow(
      RA.uniq(Str.Eq),
      RA.append(id),
    )),
    IOO.chainIOK((x) => pipe(
      () => setConfig.bannedUsers(x),
      IO.apSecond(() => defaultToast().fire({
        title: `Added Banned User: ${id}`,
        icon: 'success',
      })),
    )),
    IO.apSecond(() => {
      // eslint-disable-next-line no-param-reassign
      chat.style.display = 'none';
    }),
    // eslint-disable-next-line no-param-reassign
    (x) => () => { clone.onclick = x; },
  )),
  IO.chain((x) => () => chat.querySelector(
    '#content #message',
  )?.append(x)),
));
