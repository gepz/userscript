import * as blas from '@stdlib/blas';
import {
  ComponentType,
  defineQuery,
  ISchema,
  hasComponent,
  IWorld,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import * as IOO from 'fp-ts/IOOption';
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
import vector3 from '@/vector3';

export default ({
  isBullet,
  isEnemy,
  removing,
  displayParent,
  position,
  radius,
}: {
  isBullet: ComponentType<ISchema>,
  isEnemy: ComponentType<ISchema>,
  removing: ComponentType<ISchema>,
  displayParent: ComponentType<typeof reference>,
  position: ComponentType<typeof vector3>,
  radius: ComponentType<typeof float>,
}): IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
  () => ({
    bulletQuery: defineQuery([isBullet, position, radius]),
    enemyQuery: defineQuery([isEnemy, position, radius]),
  }),
  IO.map((q) => flow(
    IO.of,
    IO.chainFirst((w) => pipe(
      {
        bullets: q.bulletQuery(w),
        enemies: q.enemyQuery(w),
      },
      (c) => () => c.bullets.forEach((bulletId) => pipe(
        c.enemies,
        RA.findFirst((id) => !hasComponent(w, removing, id)
        && id !== bulletId
        && pipe(
          globalPosition(w)(position)(displayParent),
          (x) => ({
            bPos: x(bulletId),
            ePos: x(id),
          }),
          (x) => [
            x.bPos.x - x.ePos.x,
            x.bPos.y - x.ePos.y,
          ],
          (x) => blas.base.gnrm2(x.length, x, 1),
        ) < radius.v[bulletId] + radius.v[id]),
        IOO.fromOption,
        IOO.chainFirstIOK((x) => addComponents(w)(x)([removing])),
        IOO.chainFirstIOK(() => addComponents(w)(bulletId)([removing])),
      )()),
    )),
  )),
);
