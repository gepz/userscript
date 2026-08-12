export default (e: Event): string => {
  // ShadyDOM's manual re-dispatch can leave currentTarget null; its
  // `__target` stamp carries the pre-retargeting target, so the fallback
  // keeps a shady-handled event usable (YouTube forces the polyfill on).
  const target: unknown = e.currentTarget ?? Reflect.get(e, '__target');
  if (target instanceof HTMLSelectElement
    || target instanceof HTMLTextAreaElement
    || target instanceof HTMLInputElement) {
    return target.value;
  }

  throw Error('Event target type isn\'t acceptable.');
};
