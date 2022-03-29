import {
  IWorld,
  ComponentType,
  ISchema,
  removeComponent,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  flow,
} from 'fp-ts/function';

export default <T extends ISchema>(world: IWorld) => (
  id: number,
): R.Reader<ComponentType<T>[], IO.IO<void>> => flow(
  RA.map((c) => () => removeComponent(world, c, id)),
  IO.sequenceArray,
);
