import {
  app,
} from 'hyperapp';

import RootComponent from '@/RootComponent';
import WrappedApp from '@/WrappedApp';

export default <T>(comp: RootComponent<T>, init: T): WrappedApp<T> => {
  const node = document.createElement(comp.tag);
  return {
    node,
    dispatch: app({
      init,
      view: comp.view,
      node,
    }),
  };
};
