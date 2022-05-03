import UserConfig from '@/UserConfig';

type UserConfigState = {
  [P in keyof UserConfig]: UserConfig[P]['val'];
};

export default interface SettingState extends UserConfigState {
  showPanel: boolean,
  bannedWordRegexsValid: boolean,
  bannedWordRegexsError: string,
  mainTab: number,
  logTab: number,
  timingStepCount: number,
  eventLog: readonly string[],
  editingInput: {
    id: string,
    committedState: unknown,
    value: string,
  }
}
