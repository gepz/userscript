import * as blas from '@stdlib/blas';
import {
  ComponentType,
  defineQuery,
  System,
  ISchema,
  IWorld,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  flow,
  pipe,
} from 'fp-ts/function';

import addComponents from '@/addComponents';
import float from '@/float';
import globalPosition from '@/globalPosition';
import reference from '@/reference';
import setComponents from '@/setComponents';
import vector3 from '@/vector3';

export default ({
  portalTarget,
  isPlayer,
  displayParent,
  position,
  radius,
}: {
  portalTarget: ComponentType<typeof float>,
  isPlayer: ComponentType<ISchema>,
  displayParent: ComponentType<typeof reference>,
  position: ComponentType<typeof vector3>,
  radius: ComponentType<typeof float>,
}): IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
  () => ({
    portalQuery: defineQuery([portalTarget, position, radius]),
    playerQuery: defineQuery([isPlayer, position, radius]),
  }),
  IO.map((q) => flow(
    IO.of,
    IO.chainFirst((w) => pipe(
      {
        portals: q.portalQuery(w),
        players: q.playerQuery(w),
      },
      (c) => () => c.portals.forEach((portalId) => pipe(
        () => {},
      )()),
    )),
  )),
);
