type ChatUpdateConfig = {
  render: boolean,
  setAnimation: true,
  setPlayState: false,
} | {
  render: boolean,
  setAnimation: false,
  setPlayState: true,
} | {
  render: boolean,
  setAnimation: false,
  setPlayState: false,
};

export default ChatUpdateConfig;

