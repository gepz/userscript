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

import float from '@/float';
import removeComponents from '@/removeComponents';
import setComponents from '@/setComponents';
import vector3 from '@/vector3';

export default ({
  portalTarget,
  resettingPosition,
  position,
}: {
  portalTarget: ComponentType<typeof float>,
  resettingPosition: ComponentType<ISchema>,
  position: ComponentType<typeof vector3>,
}): IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
  () => defineQuery([
    portalTarget,
    resettingPosition,
    position,
  ]),
  IO.map((q) => flow(
    IO.of,
    IO.chainFirst((w) => () => q(w).forEach((id) => pipe(
      setComponents(id)([
        [position.x, 250],
        [position.y, 150],
      ]),
      IO.apSecond(removeComponents(w)(id)([resettingPosition])),
    )())),
  )),
);
