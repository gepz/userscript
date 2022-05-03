import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';

export default interface SettingConfig {
  command: AppCommander,
  state: SettingState,
}
