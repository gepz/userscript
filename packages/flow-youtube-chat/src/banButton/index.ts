import * as IO from 'fp-ts/IO';
import {
  pipe,
} from 'fp-ts/function';

export default pipe(
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
