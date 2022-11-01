import * as IO from 'fp-ts/IO';
import {
  pipe,
} from 'fp-ts/function';
import {
  app,
} from 'hyperapp';

import RootComponent from '@/RootComponent';
import WrappedApp from '@/WrappedApp';

export default <T>(
  comp: RootComponent<T>,
  init: T,
): IO.IO<WrappedApp<T>> => pipe(
  () => document.createElement(comp.tag),
  IO.chain((node) => () => ({
    node,
    dispatch: app({
      init,
      view: comp.view,
      node,
    }),
  }
  )),
);
