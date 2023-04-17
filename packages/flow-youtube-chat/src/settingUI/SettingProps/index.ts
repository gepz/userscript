import SettingState from '@/SettingState';
import SettingKey from '@/settingUI/SettingKey';
import SettingValue from '@/settingUI/SettingValue';

type SettingProps = {
  [K in SettingKey<unknown>]: SettingValue<K>
} & SettingState;

export default SettingProps;
