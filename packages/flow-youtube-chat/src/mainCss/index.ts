export default (): HTMLStyleElement => {
  const element = document.createElement('style');
  element.innerHTML = `.fyc_chat {
    line-height: 1;
    z-index: 30;
    position: absolute;
    user-select: none;
    white-space: nowrap;
    will-change: transform;
  }
  .fyc_button {
    display: inline-block;
    border-style: none;
    z-index: 4;
    font-weight: 500;
    color: var(--yt-spec-text-secondary);
  }`;

  return element;
};
