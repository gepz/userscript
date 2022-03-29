import {
  ComponentType,
  defineQuery,
  ISchema,
  hasComponent,
  IWorld,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import {
  flow,
  pipe,
} from 'fp-ts/function';

import addComponents from '@/addComponents';
import removeComponents from '@/removeComponents';

export default (binary: IO.IO<boolean>) => ({
  isPlayer,
  binaryInput,
}: {
  isPlayer: ComponentType<ISchema>,
  binaryInput: ComponentType<ISchema>,
}): IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
  () => defineQuery([isPlayer]),
  IO.map((q) => flow(
    IO.of,
    IO.chainFirst((w) => () => q(w).forEach((id) => pipe(
      binary,
      IO.chainFirst(flow(
        O.fromPredicate(
          (x) => x !== hasComponent(w, binaryInput, id),
        ),
        O.map((x) => (x ? addComponents : removeComponents)(w)(id)(
          [binaryInput],
        )),
        O.getOrElse(() => () => {}),
      )),
    )())),
  )),
);
