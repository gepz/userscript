import * as blas from '@stdlib/blas';
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
import vector3 from '@/vector3';

export default ({
  position,
  velocity,
  acceleration,
  maxSpeed,
  friction,
}: {
  position: ComponentType<typeof vector3>,
  velocity: ComponentType<typeof vector3>,
  acceleration: ComponentType<typeof vector3>,
  maxSpeed: ComponentType<typeof float>,
  friction: ComponentType<typeof float>,
}) => (
  deltaTime: IO.IO<number>,
) : IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
  () => defineQuery([
    position,
    velocity,
    acceleration,
    maxSpeed,
    friction,
  ]),
  IO.map((q) => flow(
    IO.of,
    IO.chainFirst((w) => () => q(w).forEach((id) => pipe(
      deltaTime,
      IO.chainFirst((x) => setComponents(id)([
        [velocity.x, velocity.x[id] + (acceleration.x[id] * x)],
        [velocity.y, velocity.y[id] + (acceleration.y[id] * x)],
      ])),
      IO.chainFirst((dt) => pipe(
        [velocity.x[id], velocity.y[id]],
        (x) => blas.base.gnrm2(x.length, x, 1),
        (speed) => pipe(
          Math.max(0, speed - (friction.v[id] * dt)),
          (newSpeed) => (newSpeed > maxSpeed.v[id] ? (maxSpeed.v[id] / speed)
          : (newSpeed / speed)),
        ),
        (x) => (Number.isNaN(x) ? 0 : x),
        IO.of,
        IO.chainFirst((ratio) => setComponents(id)([
          [velocity.x, velocity.x[id] * ratio],
          [velocity.y, velocity.y[id] * ratio],
        ])),
      )),
      IO.chainFirst((x) => setComponents(id)([
        [position.x, position.x[id] + (velocity.x[id] * x)],
        [position.y, position.y[id] + (velocity.y[id] * x)],
      ])),
    )())),
  )),
);
