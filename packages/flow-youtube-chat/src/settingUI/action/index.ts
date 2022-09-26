import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';

export default ({
  copy: () => (s: SettingState) => async () => {
    GM.setClipboard(s.eventLog.join('\n'));
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearFlowChats: (c: AppCommander) => (s: SettingState) => async () => {
    c.act.clearFlowChats();
  },
});
