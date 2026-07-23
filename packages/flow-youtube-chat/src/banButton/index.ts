import {
  Effect as Z,
  Array as A,
  String as Str,
  pipe,
} from 'effect';

import UserConfigGetter from '@/UserConfigGetter';
import UserConfigSetter from '@/UserConfigSetter';
import runLogged from '@/runLogged';
// import defaultToast from '@/defaultToast';

const template = runLogged(pipe(
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
    background: 'none',
    // Breathing room from the preceding text; inline-start so it also
    // holds in RTL messages (dir="auto").
    marginInlineStart: '4px',
  }))),
  Z.tap((x) => Z.sync(() => x.setAttribute(
    'aria-label',
    'NGに入れる(Ban this user)',
  ))),
  Z.tap((x) => Z.sync(() => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'style-scope yt-icon');
    Object.assign(svg.style, {
      width: '100%',
      height: '75%',
      // Fixed white-on-dark-halo rather than a theme variable, so the
      // glyph reads the same on both YouTube themes and on colored
      // cards. The halo is painted behind the fill (paint-order), so
      // only the outer half of the stroke outlines the glyph; 32 user
      // units in the 512 viewBox is about 0.6px outside the glyph at
      // the rendered 20px size.
      fill: '#fff',
      stroke: '#0009',
      strokeWidth: '32',
      paintOrder: 'stroke',
    });

    svg.setAttribute('viewBox', '0 0 512 512');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M440 78A256 256 0 1 0 73 435 256 256 0 0 0 440 78zm-99 35L113'
      + ' 341C37 179 212 44 341 113zM177 405l228-228c76 162-99 297-228 228z',
    );

    path.setAttribute('fill-rule', 'evenodd');

    svg.appendChild(path);
    x.appendChild(svg);
  })),
));

// entry is a bannedUsers row (see @/BanEntry for the format).
export default (
  entry: string,
) => (
  getConfig: UserConfigGetter,
) => (
  setConfig: UserConfigSetter,
) => (
  chat: HTMLElement,
): Z.Effect<HTMLElement> => pipe(
  getConfig.bannedUsers,
  Z.filterOrFail((x): boolean => !x.includes(entry)),
  Z.map((x) => pipe(
    A.dedupeWith(x, Str.Equivalence),
    A.append(entry),
  )),
  Z.flatMap((x) => pipe(
    setConfig.bannedUsers(x),
    // Z.zipRight(Z.sync(() => defaultToast.fire({
    //   title: `Added Banned User: ${id}`,
    //   icon: 'success',
    // }))),
  )),
  Z.ignore,
  Z.zipRight(Z.sync(() => {
    chat.style.display = 'none';
  })),
  (onclick) => pipe(
    Z.promise(() => template),
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    Z.map((x) => x.cloneNode(true) as HTMLElement),

    Z.tap((x) => Z.sync(() => { x.onclick = () => runLogged(onclick); })),
  ),
);
