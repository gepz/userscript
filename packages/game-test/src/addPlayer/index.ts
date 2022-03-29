import {
  addEntity,
  ComponentType,
  ISchema,
  IWorld,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import {
  pipe,
} from 'fp-ts/function';

import addComponents from '@/addComponents';
import float from '@/float';
import setComponents from '@/setComponents';
import vector2 from '@/vector2';
import vector3 from '@/vector3';

export default (
  world: IWorld,
) => ({
  position,
  radius,
  velocity,
  acceleration,
  maxSpeed,
  friction,
  movementInput,
  movingAcceleration,
  isPlayer,
  isCharacter,
  resettingPosition,
}: {
  position: ComponentType<typeof vector3>,
  radius: ComponentType<typeof float>,
  velocity: ComponentType<typeof vector3>,
  acceleration: ComponentType<typeof vector3>,
  maxSpeed: ComponentType<typeof float>,
  friction: ComponentType<typeof float>,
  movementInput: ComponentType<typeof vector2>,
  movingAcceleration: ComponentType<typeof float>,
  isPlayer: ComponentType<ISchema>,
  isCharacter: ComponentType<ISchema>,
  resettingPosition: ComponentType<ISchema>,
}): IO.IO<number> => pipe(
  () => addEntity(world),
  IO.chainFirst((x) => addComponents(world)(x)([
    position,
    velocity,
    radius,
    acceleration,
    maxSpeed,
    movementInput,
    movingAcceleration,
    friction,
    isPlayer,
    isCharacter,
    resettingPosition,
  ])),
  IO.chainFirst((x) => setComponents(x)([
    [radius.v, 15],
    [maxSpeed.v, 1.8],
    [movingAcceleration.v, 0.6],
    [friction.v, 0.08],
  ])),
);
