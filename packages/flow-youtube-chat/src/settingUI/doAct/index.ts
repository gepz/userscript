import SettingConfig from '@/SettingConfig';

export default ({
  copy: async (c: SettingConfig) => {
    GM.setClipboard(c.state.eventLog.join('\n'));
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clearFlowChats: async (c: SettingConfig) => {
    c.command.act.clearFlowChats();
  },
});
