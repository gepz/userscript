export default (
  anchor: HTMLAnchorElement,
  name: string,
  value: string,
): void => {
  const newURL = new URL(anchor.href, window.location.href);
  newURL.searchParams.set(name, value);
  anchor.href = newURL.href;
};
