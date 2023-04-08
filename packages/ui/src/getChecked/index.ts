import {
  z,
} from 'zod';

export default (e: Event): boolean => z.instanceof(HTMLInputElement).parse(
  e.currentTarget,
).checked;
