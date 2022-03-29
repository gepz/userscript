import {
  ComponentType,
  hasComponent,
  ISchema,
  IWorld,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import {
  IORef,
} from 'fp-ts/IORef';
import * as Tree from 'fp-ts/Tree';
import {
  flow,
  pipe,
} from 'fp-ts/function';

import GameState from '@/GameState';
import addComponents from '@/addComponents';
import float from '@/float';
import reference from '@/reference';
import setComponents from '@/setComponents';
import vector3 from '@/vector3';

export default (
  world: IWorld,
) => ({
  radius,
  position,
  isPlayer,
  displayParent,
}: {
  radius: ComponentType<typeof float>,
  position: ComponentType<typeof vector3>,
  isPlayer: ComponentType<ISchema>,
  displayParent: ComponentType<typeof reference>,
}) => (
  addPlayerFn: IO.IO<number>,
) => (
  addWeaponFn: IO.IO<number>,
) => (
  state: IORef<GameState>,
): IO.IO<unknown> => pipe(
  IO.Do,
  flow(
    IO.apS('player', addPlayerFn),
    IO.chainFirst((c) => state.modify((s) => pipe(
      Tree.of(c.player),
      (t): GameState => ({
        ...s,
        displayRoot: [...s.displayRoot, t],
        displayTreeMap: s.displayTreeMap.set(c.player, t),
      }),
    ))),
  ),
  flow(
    IO.apS('playerWeapon', addWeaponFn),
    IO.chainFirst((x) => (hasComponent(world, position, x.player)
      ? setComponents(x.playerWeapon)([
        [position.x, 0],
        [position.y, -radius.v[x.player]],
      ]) : () => {})),
    IO.chainFirst((c) => state.modify((s) => pipe(
      Tree.of(c.playerWeapon),
      (x): GameState => ({
        ...s,
        displayRoot: (s.displayTreeMap.get(c.player)?.forest.push(x),
        s.displayRoot),
        displayTreeMap: s.displayTreeMap.set(c.playerWeapon, x),
      }),
    ))),
    IO.chainFirst((x) => addComponents(world)(x.playerWeapon)([
      displayParent,
      isPlayer,
    ])),
    IO.chainFirst((x) => setComponents(x.playerWeapon)(
      [[displayParent.v, x.player]],
    )),
  ),
);
