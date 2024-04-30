import {
  Predicate as P,
} from 'effect';

import SettingState from '@/SettingState';

export default ({
  useStepTiming: (s: SettingState) => P.isTruthy(
    s.timingFunction.match(/^steps\(.+/),
  ),
});
