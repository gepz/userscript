import SettingState from '@/SettingState';

export default ({
  useStepTiming: (s: SettingState) => Boolean(
    s.timingFunction.match(/^steps\(.+/),
  ),
});
