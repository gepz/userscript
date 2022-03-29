import {
  addEntity,
  ComponentType,
  ISchema,
  IWorld,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import {
  flow,
  pipe,
  apply,
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
  acceleration,
  maxSpeed,
  friction,
  radius,
  isBullet,
  lifeTime,
}: {
  position: ComponentType<typeof vector3>,
  velocity: ComponentType<typeof vector3>,
  acceleration: ComponentType<typeof vector3>,
  maxSpeed: ComponentType<typeof float>,
  friction: ComponentType<typeof float>,
  radius: ComponentType<typeof float>,
  isBullet: ComponentType<ISchema>,
  lifeTime: ComponentType<typeof float>,
}): IO.IO<number> => pipe(
  () => addEntity(world),
  IO.chainFirst(flow(
    addComponents(world),
    apply([
      position,
      velocity,
      acceleration,
      maxSpeed,
      friction,
      radius,
      isBullet,
      lifeTime,
    ]),
  )),
  IO.chainFirst(flow(
    setComponents,
    (x) => x([
      [velocity.y, -2.2],
      [radius.v, 4],
      [maxSpeed.v, Infinity],
      [lifeTime.v, 90],
    ]),
  )),
);
