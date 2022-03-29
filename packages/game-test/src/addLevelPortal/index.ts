import {
  addEntity,
  ComponentType,
  ISchema,
  IWorld,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import {
  IORef,
} from 'fp-ts/IORef';
import {
  pipe,
} from 'fp-ts/function';

import GameState from '@/GameState';
import addComponents from '@/addComponents';
import float from '@/float';
import setComponents from '@/setComponents';
import vector3 from '@/vector3';

export default (
  world: IWorld,
) => ({
  position,
  radius,
  resettingPosition,
  portalTarget,
  interactable,
  hasHoverText,
}: {
  position: ComponentType<typeof vector3>,
  radius: ComponentType<typeof float>,
  resettingPosition: ComponentType<ISchema>,
  portalTarget: ComponentType<typeof float>,
  interactable: ComponentType<ISchema>,
  hasHoverText: ComponentType<ISchema>,
}) => (
  state: IORef<GameState>,
): IO.IO<number> => pipe(
  () => addEntity(world),
  IO.chainFirst((x) => addComponents(world)(x)([
    position,
    radius,
    resettingPosition,
    portalTarget,
    interactable,
    hasHoverText,
  ])),
  IO.chainFirst((x) => setComponents(x)([[radius.v, 20]])),
  IO.chainFirst((x) => state.modify((s): GameState => ({
    ...s,
    stringMap: s.stringMap.set(x, 'Press E to Enter'),
  }))),
);
