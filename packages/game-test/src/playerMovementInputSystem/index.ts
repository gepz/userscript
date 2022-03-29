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

export default (playerInput: IO.IO<{
  x: number,
  y: number,
}>) => ({
  isPlayer,
  movementInput,
}: {
  isPlayer: ComponentType<ISchema>,
  movementInput: ComponentType<typeof vector2>,
}): IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
  () => defineQuery([
    isPlayer,
    movementInput,
  ]),
  IO.map((q) => flow(
    IO.of,
    IO.chainFirst((w) => () => q(w).forEach((id) => pipe(
      playerInput,
      IO.chainFirst((x) => setComponents(id)([
        [movementInput.x, x.x],
        [movementInput.y, x.y],
      ])),
    )())),
  )),
);
