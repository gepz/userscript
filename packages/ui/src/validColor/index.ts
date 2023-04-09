import validateColor from 'validate-color';

export default (x: string): boolean => validateColor(
  x.replace(/grey/ig, 'gray'),
);
