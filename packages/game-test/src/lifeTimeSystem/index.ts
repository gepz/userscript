import {
  ComponentType,
  defineQuery,
  ISchema,
  Not,
  IWorld,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import * as R from 'fp-ts/Reader';
import {
  flow,
  pipe,
} from 'fp-ts/function';

import addComponents from '@/addComponents';
import float from '@/float';
import setComponents from '@/setComponents';

export default ({
  removing,
  lifeTime,
}: {
  removing: ComponentType<ISchema>,
  lifeTime: ComponentType<typeof float>,
}) => (
  deltaTime: IO.IO<number>,
) : IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
  () => defineQuery([lifeTime, Not(removing)]),
  IO.map((q) => flow(
    IO.of,
    IO.chainFirst((w) => () => q(w).forEach((id) => pipe(
      () => lifeTime.v[id],
      IO.chainFirst((l) => (l < 0 ? addComponents(w)(id)([removing])
      : pipe(
        deltaTime,
        IO.chainFirst((x) => setComponents(id)(
          [[lifeTime.v, l - x]],
        )),
      ))),
    )())),
  )),
);
