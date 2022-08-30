import {
  pipe,
} from 'fp-ts/function';
import {
  app,
} from 'hyperapp';

import RootComponent from '@/RootComponent';
import WrappedApp from '@/WrappedApp';

export default <T>(comp: RootComponent<T>, init: T): WrappedApp<T> => pipe(
  document.createElement(comp.tag),
  (node) => ({
    node,
    dispatch: app({
      init,
      view: comp.view,
      node,
    }),
  }
  ),
);
