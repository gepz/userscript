import {
  parseSync,
} from '@effect/schema/Parser';
import {
  instanceOf,
} from '@effect/schema/Schema';

export default (e: Event): boolean => parseSync(instanceOf(HTMLInputElement))(
  e.currentTarget,
).checked;
