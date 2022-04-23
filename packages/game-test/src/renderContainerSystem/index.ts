import {
  ComponentType,
  defineQuery,
  exitQuery,
  ISchema,
  IWorld,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import * as IOO from 'fp-ts/IOOption';
import * as R from 'fp-ts/Reader';
import * as RM from 'fp-ts/ReadonlyMap';
import {
  flow,
  pipe,
} from 'fp-ts/function';
import * as N from 'fp-ts/number';
import * as PIXI from 'pixi.js';

import vector3 from '@/vector3';

export default (
  containers: Map<number, PIXI.Container>,
) => ({
  position,
  isVisible,
}: {
  position: ComponentType<typeof vector3>,
  isVisible: ComponentType<ISchema>,
}): IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
  () => defineQuery([
    position,
    isVisible,
  ]),
  IO.map((q) => flow(
    IO.of,
    IO.chainFirst((w) => () => q(w).forEach((id) => pipe(
      containers,
      RM.lookup(N.Eq)(id),
      IOO.fromOption,
      // eslint-disable-next-line no-param-reassign
      IOO.chainFirst((x) => IOO.fromIO(() => { x.x = position.x[id]; })),
      // eslint-disable-next-line no-param-reassign
      IOO.chainFirst((x) => IOO.fromIO(() => { x.y = position.y[id]; })),
    )())),
    IO.chainFirst((w) => () => exitQuery(q)(w).forEach((id) => pipe(
      containers,
      RM.lookup(N.Eq)(id),
      IOO.fromOption,
      IOO.chainFirst(() => IOO.fromIO(() => containers.delete(id))),
      IOO.chainFirst((x) => IOO.fromIO(() => x.parent.removeChild(x))),
    )())),
  )),
);
