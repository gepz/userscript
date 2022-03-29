import {
  ComponentType,
  hasComponent,
  IWorld,
} from 'bitecs';
import * as E from 'fp-ts/Either';
import * as I from 'fp-ts/Identity';
import {
  pipe,
} from 'fp-ts/function';

import reference from '@/reference';
import vector3 from '@/vector3';

export default (
  world: IWorld,
) => (
  position: ComponentType<typeof vector3>,
) => (
  displayParent: ComponentType<typeof reference>,
) => (id: number): {
  x: number,
  y: number,
} => I.ChainRec.chainRec({
  x: 0,
  y: 0,
  i: id,
}, (c) => (
  hasComponent(world, position, c.i) ? pipe(
    {
      x: c.x + position.x[c.i],
      y: c.y + position.y[c.i],
    },
    (x) => (hasComponent(world, displayParent, c.i) ? E.left({
      x: x.x,
      y: x.y,
      i: displayParent.v[c.i],
    }) : E.right(x)),
  ) : E.right({
    x: c.x,
    y: c.y,
  })
));
