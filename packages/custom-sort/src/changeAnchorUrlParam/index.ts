export default (
  anchor: HTMLAnchorElement,
  name: string,
  value: string,
): void => {
  const newURL = new URL(anchor.href, window.location.href);
  newURL.searchParams.set(name, value);
  // eslint-disable-next-line no-param-reassign
  anchor.href = newURL.href;
};
