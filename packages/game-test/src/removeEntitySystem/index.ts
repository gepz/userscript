import {
  ComponentType,
  defineQuery,
  ISchema,
  removeEntity,
  hasComponent,
  IWorld,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import {
  IORef,
} from 'fp-ts/IORef';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
  flow,
} from 'fp-ts/function';

import GameState from '@/GameState';
import reference from '@/reference';

export default ({
  removing,
  displayParent,
}: {
  removing: ComponentType<ISchema>,
  displayParent: ComponentType<typeof reference>,
}) => (
  state: IORef<GameState>,
): IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
  () => defineQuery([removing]),
  IO.map((q) => flow(
    IO.of,
    IO.chainFirst((w) => () => q(w).forEach((id) => pipe(
      () => hasComponent(w, displayParent, id),
      IO.chain((hasParent) => (hasParent ? state.modify((s) => ({
        ...s,
        displayRoot: pipe(
          s.displayTreeMap.get(displayParent.v[id]),
          O.fromNullable,
          O.map((x) => x.forest),
          O.alt(() => (s.displayTreeMap.has(id) ? O.of(s.displayRoot)
          : O.none)),
          O.bindTo('forest'),
          O.bind('index', (c) => pipe(
            c.forest,
            RA.findIndex((x) => x.value === id),
          )),
          O.map((x) => () => x.forest.splice(x.index, 1)),
          O.getOrElse(() => () => {}),
          IO.map(() => s.displayRoot),
        )(),
      })) : () => {})),
      IO.apFirst(state.modify((s) => ({
        ...s,
        displayTreeMap: (s.displayTreeMap.delete(id), s.displayTreeMap),
        stringMap: (s.stringMap.delete(id), s.stringMap),
      }))),
      IO.apFirst(() => {
        removeEntity(w, id);
      }),
    )())),
  )),
);
