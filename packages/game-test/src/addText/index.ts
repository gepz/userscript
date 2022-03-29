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
import vector3 from '@/vector3';

export default (
  world: IWorld,
) => (
  position: ComponentType<typeof vector3>,
) => (
  isText: ComponentType<ISchema>,
): IO.IO<number> => pipe(
  () => addEntity(world),
  IO.chainFirst(flow(
    addComponents(world),
    apply([
      position,
      isText,
    ]),
  )),
);
