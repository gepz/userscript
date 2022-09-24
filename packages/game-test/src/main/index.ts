import * as IO from 'fp-ts/IO';
import * as T from 'fp-ts/Task';
import {
  pipe,
} from 'fp-ts/function';
import * as PIXI from 'pixi.js';

import defaultAppConfig from '@/defaultAppConfig';
import gameTask from '@/gameTask';

export default pipe(
  () => new PIXI.Application(defaultAppConfig()),
  IO.chainFirst((x) => () => document.body.appendChild(x.view)),
  T.fromIO,
  T.bindTo('app'),
  T.bind('sub', ({
    app,
  }) => gameTask(app)),
  T.chainFirstIOK((x) => () => {
    x.sub.unsubscribe();
    x.app.destroy();
  }),
) satisfies IO.IO<void>;
