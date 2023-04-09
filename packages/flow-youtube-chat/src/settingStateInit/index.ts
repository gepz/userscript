import {
  pipe,
} from '@effect/data/Function';
// import * as O from '@effect/data/Option';
// import * as expEval from 'expression-eval';

import * as log from '@/Log';
import MappedConfigState from '@/MappedConfigState';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import isEditable from '@/isEditable';
import mapObject from '@/mapObject';
// import Compound from '@/settingUI/EditableExpression/Compound';
import settingsPanelSize from '@/settingsPanelSize';
import * as Ed from '@userscript/ui/Editable';

// import fromJsepExp from '@/settingUI/EditableExpression/fromJsepExp';

export default (config: UserConfig): SettingState => pipe(
  config,
  mapObject(([k, v]) => [
    k,
    isEditable(k)(v) ? Ed.of(v)
    : k === 'filterExp' ? undefined
    // : k === 'filterExp' ? pipe(
    // eslint-disable-next-line max-len
    //   // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    //   fromJsepExp(v as expEval.parse.Expression),
    //   O.getOrElse((): Compound => ({
    //     type: 'Compound',
    //     body: [],
    //   })),
    // )
    : v,
  ]),
  (x: MappedConfigState) => ({
    ...x,
    showPanel: false,
    mainTab: 0,
    logTab: 0,
    timingStepCount: Ed.of(parseInt(config.timingFunction.match(
      /^steps\((\d+),.+/,
    )?.[1] ?? '150', 10)),
    eventLog: log.empty(),
    panelRect: new DOMRectReadOnly(
      0,
      0,
      settingsPanelSize.width,
      settingsPanelSize.height,
    ),
  }),
);
