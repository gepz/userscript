import {
  ComponentType,
  defineQuery,
  enterQuery,
  ISchema,
  hasComponent,
  IWorld,
} from 'bitecs';
import * as IOO from 'fp-ts-contrib/IOOption';
import * as IO from 'fp-ts/IO';
import * as R from 'fp-ts/Reader';
import {
  flow,
  pipe,
} from 'fp-ts/function';
import * as PIXI from 'pixi.js';

import addComponents from '@/addComponents';
import reference from '@/reference';
import text from '@/text';
import vector3 from '@/vector3';

export default (
  app: PIXI.Application,
) => (
  containers: Map<number, PIXI.Container>,
) => ({
  displayParent,
  position,
  isText,
  isVisible,
}: {
  displayParent: ComponentType<typeof reference>,
  position: ComponentType<typeof vector3>,
  isText: ComponentType<ISchema>,
  isVisible: ComponentType<ISchema>,
}) => (
  stringMap: IO.IO<Map<number, string>>,
): IO.IO<R.Reader<IWorld, IO.IO<IWorld>>> => pipe(
  () => defineQuery([
    position,
    isText,
  ]),
  IO.map((q) => flow(
    IO.of,
    IO.chainFirst((w) => () => enterQuery(q)(w).forEach((id) => pipe(
      stringMap().get(id),
      IOO.fromNullable,
      IOO.chain((x) => IOO.fromIO(text(x))),
      IOO.chainFirst(() => IOO.fromIO(addComponents(w)(id)([isVisible]))),
      IOO.chainFirst((x) => IOO.fromIO(() => containers.set(id, x))),
      IOO.chainFirst((x) => IOO.fromIO(hasComponent(w, displayParent, id)
        ? () => containers.get(displayParent.v[id])?.addChild(x)
        : () => app.stage.addChild(x))),
    )())),
  )),
);
