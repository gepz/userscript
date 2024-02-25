import {
  decodeUnknownSync,
} from '@effect/schema/Parser';
import {
  instanceOf,
} from '@effect/schema/Schema';

export default (e: Event): boolean => decodeUnknownSync(
  instanceOf(HTMLInputElement),
)(
  e.currentTarget,
).checked;

