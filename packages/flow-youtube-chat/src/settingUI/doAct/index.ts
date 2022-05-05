import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';

export default ({
  copy: () => async (s: SettingState) => {
    GM.setClipboard(s.eventLog.join('\n'));
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearFlowChats: (c: AppCommander) => async (s: SettingState) => {
    c.act.clearFlowChats();
  },
});
