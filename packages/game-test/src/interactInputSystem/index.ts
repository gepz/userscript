import {
  ComponentType,
  defineQuery,
  enterQuery,
  hasComponent,
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
import globalPosition from '@/globalPosition';
import reference from '@/reference';
import setComponents from '@/setComponents';
import vector3 from '@/vector3';

export default ({
  interactInput,
  lastShoot,
  bulletInterval,
  position,
  displayParent,
}: {
  interactInput: ComponentType<ISchema>,
  lastShoot: ComponentType<typeof float>,
  bulletInterval: ComponentType<typeof float>,
  position: ComponentType<typeof vector3>,
  displayParent: ComponentType<typeof reference>,
}) => (
  now: IO.IO<number>,
) => (
  addBulletFn: IO.IO<number>,
): IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
  () => defineQuery([
    interactInput,
    lastShoot,
    bulletInterval,
    position,
  ]),
  IO.map((q) => flow(
    IO.of,
    IO.chainFirst((w) => () => enterQuery(q)(w).forEach((id) => pipe(
      now,
      IO.chainFirst((x) => setComponents(id)([
        [
          lastShoot.v,
          Math.max(lastShoot.v[id], x - bulletInterval.v[id]),
        ],
      ])),
    )())),
    IO.chainFirst((w) => () => q(w).forEach((id) => pipe(
      now,
      IO.chainFirst((n) => (
        n >= lastShoot.v[id] + bulletInterval.v[id] ? pipe(
          addBulletFn,
          IO.chainFirst((b) => (hasComponent(w, position, b)
            ? setComponents(b)(pipe(
              globalPosition(w)(position)(displayParent)(id),
              (x) => [
                [position.x, x.x],
                [position.y, x.y],
              ],
            )) : () => {})),
          IO.apSecond(setComponents(id)(
            [[lastShoot.v, lastShoot.v[id] + bulletInterval.v[id]]],
          )),
        ) : () => {})),
    )())),
  )),
);
