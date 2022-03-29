export default (classNames: string[]): string => (
  classNames.map((x) => `.${x}`).join('')
);
