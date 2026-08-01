// import * as expEval from 'expression-eval';
import * as Ed from '@userscript/ui/Editable';
import {
  Option as O,
  Record as R,
  pipe,
} from 'effect';

import * as log from '@/Log';
import MappedConfigState from '@/MappedConfigState';
import SettingState from '@/SettingState';
import UserConfig from '@/UserConfig';
import isEditable from '@/isEditable';
// import Compound from '@/settingUI/editableExpression/Compound';
import {
  SettingsPanelSize,
} from '@/settingsPanelSize';

// import fromJsepExp from '@/settingUI/editableExpression/fromJsepExp';

export default (
  panelSize: SettingsPanelSize,
) => (config: UserConfig): SettingState => pipe(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  R.mapEntries(config, (v, k) => [
    k,
    isEditable(k)(v)
      ? Ed.of(v)
      : k === 'filterExp'
        ? undefined
      // ? pipe(

      //   // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      //   fromJsepExp(v as expEval.parse.Expression),
      //   O.getOrElse((): Compound => ({
      //     type: 'Compound',
      //     body: [],
      //   })),
      // )
        : v,
  ]) as MappedConfigState,
  (x) => ({
    ...x,
    showPanel: false,
    mainTab: 0,
    logTab: 0,
    timingStepCount: Ed.of(parseInt(config.timingFunction.match(
      /^steps\((\d+),.+/,
    )?.[1] ?? '150', 10)),
    eventLog: log.empty(),
    laneHover: O.none(),
    lanePaintTarget: O.none(),
    panelRect: new DOMRectReadOnly(
      0,
      0,
      panelSize.width,
      panelSize.height,
    ),
  }),
);
