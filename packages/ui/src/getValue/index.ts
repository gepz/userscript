export default (e: Event): string => {
  // ShadyDOM stamps the pre-retargeting target on events it handles as
  // `__target`, and its manual re-dispatch (shadyDispatchEvent) can run
  // listeners outside native dispatch, where currentTarget is null. YouTube
  // forces the polyfill on even where shadow DOM is native
  // (window.ShadyDOM settings: {force: true, noPatch: true}, verified
  // 2026-08), so the fallback keeps a shady-handled event usable.
  const target: unknown = e.currentTarget ?? Reflect.get(e, '__target');
  if (target instanceof HTMLSelectElement
    || target instanceof HTMLTextAreaElement
    || target instanceof HTMLInputElement) {
    return target.value;
  }

  throw Error('Event target type isn\'t acceptable.');
};
