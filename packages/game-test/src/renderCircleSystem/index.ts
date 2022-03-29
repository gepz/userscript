import {
  ComponentType,
  defineQuery,
  enterQuery,
  hasComponent,
  ISchema,
  IWorld,
} from 'bitecs';
import * as IO from 'fp-ts/IO';
import * as R from 'fp-ts/Reader';
import {
  flow,
  pipe,
} from 'fp-ts/function';
import * as PIXI from 'pixi.js';

import addComponents from '@/addComponents';
import circle from '@/circle';
import float from '@/float';
import reference from '@/reference';
import vector3 from '@/vector3';

export default (
  app: PIXI.Application,
) => (
  containers: Map<number, PIXI.Container>,
) => ({
  displayParent,
  position,
  radius,
  isVisible,
}: {
  displayParent: ComponentType<typeof reference>,
  position: ComponentType<typeof vector3>,
  radius: ComponentType<typeof float>,
  isVisible: ComponentType<ISchema>,
}): IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
  () => defineQuery([
    position,
    radius,
  ]),
  IO.map((q) => flow(
    IO.of,
    IO.chainFirst((w) => () => enterQuery(q)(w).forEach((id) => pipe(
      circle(radius.v[id]),
      IO.chainFirst(() => addComponents(w)(id)([isVisible])),
      IO.chainFirst((x) => () => containers.set(id, x)),
      IO.chainFirst((x) => (hasComponent(w, displayParent, id)
        ? () => containers.get(displayParent.v[id])?.addChild(x)
        : () => app.stage.addChild(x))),
    )())),
  )),
);
