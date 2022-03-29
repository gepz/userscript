import {
  ComponentType,
  defineQuery,
  IWorld,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import * as R from 'fp-ts/Reader';
import {
  flow,
  pipe,
} from 'fp-ts/function';

import float from '@/float';
import setComponents from '@/setComponents';
import vector2 from '@/vector2';
import vector3 from '@/vector3';

export default ({
  movementInput,
  movingAcceleration,
  acceleration,
}: {
  movementInput: ComponentType<typeof vector2>,
  movingAcceleration: ComponentType<typeof float>,
  acceleration: ComponentType<typeof vector3>,
}): IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
  () => defineQuery([
    movementInput,
    movingAcceleration,
    acceleration,
  ]),
  IO.map((q) => flow(
    IO.of,
    IO.chainFirst((w) => () => q(w).forEach((id) => pipe(
      movingAcceleration.v[id],
      IO.of,
      IO.chainFirst((x) => setComponents(id)([
        [acceleration.x, movementInput.x[id] * x],
        [acceleration.y, movementInput.y[id] * x],
      ])),
    )())),
  )),
);
