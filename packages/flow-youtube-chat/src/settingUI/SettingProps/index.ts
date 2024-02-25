import SettingKey from '@/settingUI/SettingKey';
import SettingValue from '@/settingUI/SettingValue';

type SettingProps = {
  [K in SettingKey<unknown>]: SettingValue<K>
};

export default SettingProps;

