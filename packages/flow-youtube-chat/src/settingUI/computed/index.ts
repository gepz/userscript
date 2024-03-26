import * as P from 'effect/Predicate';

import SettingState from '@/SettingState';

export default ({
  useStepTiming: (s: SettingState) => P.isTruthy(
    s.timingFunction.match(/^steps\(.+/),
  ),
});
