import * as Z from 'effect/Effect';
import {
  pipe,
} from 'effect/Function';
import {
  app,
} from 'hyperapp';

import RootComponent from '@/RootComponent';
import WrappedApp from '@/WrappedApp';

export default <T>(
  comp: RootComponent<T>,
  init: T,
): Z.Effect<never, never, WrappedApp<T>> => pipe(
  Z.sync(() => document.createElement(comp.tag)),
  Z.flatMap((node) => Z.sync(() => ({
    node,
    dispatch: app({
      init,
      view: comp.view,
      node,
    }),
  }
  ))),
);
