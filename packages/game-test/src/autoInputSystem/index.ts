import {
  ComponentType,
  defineQuery,
  ISchema,
  IWorld,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import * as R from 'fp-ts/Reader';
import {
  flow,
  pipe,
} from 'fp-ts/function';

import setComponents from '@/setComponents';
import vector2 from '@/vector2';
import vector3 from '@/vector3';

export default ({
  isAuto,
  movementInput,
  position,
}: {
  isAuto: ComponentType<ISchema>,
  movementInput: ComponentType<typeof vector2>,
  position: ComponentType<typeof vector3>,
}): IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
  () => defineQuery([
    isAuto,
    movementInput,
    position,
  ]),
  IO.map((q) => flow(
    IO.of,
    IO.chainFirst((w) => () => q(w).forEach((id) => pipe(
      setComponents(id)([
        [
          movementInput.x,
          pipe(
            movementInput.x[id],
            pipe(
              position.x[id],
              (x) => (x > 350 ? () => -1
              : x < 150 ? () => 1 : Math.sign),
            ),
          ),
        ],
      ]),
      IO.chainFirst(() => setComponents(id)([[movementInput.y, 0]])),
    )())),
  )),
);
