export default (): HTMLElement => {
  const element = document.createElement('div');
  element.style.pointerEvents = 'none';
  element.style.zIndex = '30';
  element.style.position = 'absolute';
  element.style.overflow = 'hidden';
  element.style.height = '100%';
  element.style.width = '100%';
  return element;
};
