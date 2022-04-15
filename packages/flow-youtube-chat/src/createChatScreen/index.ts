export default (): HTMLElement => {
  const element = document.createElement('div');
  Object.assign<
  CSSStyleDeclaration,
  Partial<CSSStyleDeclaration>
  >(element.style, {
    pointerEvents: 'none',
    zIndex: '30',
    position: 'absolute',
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  });

  return element;
};
