import * as expEval from 'expression-eval';
import * as O from 'fp-ts/Option';
import {
  pipe,
  flow,
} from 'fp-ts/function';

import MappedConfigState from '@/MappedConfigState';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import isEditable from '@/isEditable';
import mapObject from '@/mapObject';
import Compound from '@/settingUI/EditableExpression/Compound';
import fromJsepExp from '@/settingUI/EditableExpression/fromJsepExp';
import settingsPanelSize from '@/settingsPanelSize';
import * as Ed from '@/ui/Editable';

export default (config: UserConfig): SettingState => pipe(
  config,
  mapObject(flow(
    ([k, v]) => [
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
    ],
  )),
  (x: MappedConfigState) => ({
    ...x,
    showPanel: false,
    mainTab: 0,
    logTab: 0,
    timingStepCount: Ed.of(parseInt(config.timingFunction.match(
      /^steps\((\d+),.+/,
    )?.[1] ?? '150', 10)),
    eventLog: [],
    panelRect: new DOMRectReadOnly(
      0,
      0,
      settingsPanelSize.width,
      settingsPanelSize.height,
    ),
  }),
);
