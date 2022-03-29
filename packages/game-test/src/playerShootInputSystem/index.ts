import {
  ComponentType,
  ISchema,
} from 'bitecs';
import * as R from 'fp-ts/Reader';
import {
  pipe,
} from 'fp-ts/function';

import playerBinaryInputSystem from '@/playerBinaryInputSystem';

export default pipe(
  playerBinaryInputSystem,
  R.map(R.local((x: {
    isPlayer: ComponentType<ISchema>,
    shootInput: ComponentType<ISchema>,
  }) => ({
    ...x,
    binaryInput: x.shootInput,
  }))),
);
