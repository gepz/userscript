import * as expEval from 'expression-eval';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
} from 'fp-ts/function';

import MappedConfigState from '@/MappedConfigState';
import SettingState from '@/SettingState';
import UserConfigGetter from '@/UserConfigGetter';
import isEditable from '@/isEditable';
import Compound from '@/settingUI/EditableExpression/Compound';
import fromJsepExp from '@/settingUI/EditableExpression/fromJsepExp';
import * as Ed from '@/ui/Editable';

export default (getConfig: UserConfigGetter): SettingState => pipe(
  Object.entries<() => unknown>(getConfig),
  RA.map(([k, v]) => [k, v()] as const),
  RA.map(([k, v]) => [
    k,
    isEditable(k)(v) ? Ed.of(v)
    : k === 'filterExp' ? pipe(
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      fromJsepExp(v as expEval.parse.Expression),
      O.getOrElseW((): Compound => ({
        type: 'Compound',
        body: [],
      })),
    )
    : v,
  ] as const),
  Object.fromEntries,
  (x: MappedConfigState) => ({
    ...x,
    showPanel: false,
    mainTab: 0,
    logTab: 0,
    timingStepCount: Ed.of(parseInt(getConfig.timingFunction().match(
      /^steps\((\d+),.+/,
    )?.[1] ?? '150', 10)),
    eventLog: [],
  }),
);
