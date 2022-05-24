import validateColor from 'validate-color';

export default (x: string) => validateColor(x.replace(/grey/ig, 'gray'));
