import {
  addEntity,
  ComponentType,
  IWorld,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import {
  pipe,
  apply,
  flow,
} from 'fp-ts/function';

import addComponents from '@/addComponents';
import float from '@/float';
import setComponents from '@/setComponents';
import vector3 from '@/vector3';

export default (
  world: IWorld,
) => ({
  position,
  velocity,
  radius,
  bulletInterval,
  lastShoot,
}: {
  position: ComponentType<typeof vector3>,
  velocity: ComponentType<typeof vector3>,
  radius: ComponentType<typeof float>,
  bulletInterval: ComponentType<typeof float>,
  lastShoot: ComponentType<typeof float>,
}): IO.IO<number> => pipe(
  () => addEntity(world),
  IO.chainFirst(flow(
    addComponents(world),
    apply([
      position,
      velocity,
      radius,
      bulletInterval,
      lastShoot,
    ]),
  )),
  IO.chainFirst(flow(
    setComponents,
    (x) => x([
      [radius.v, 6],
      [bulletInterval.v, 25],
    ]),
  )),
);
