import {
  instanceOf,
  decodeUnknownSync,
} from 'effect/Schema';

export default (e: Event): boolean => decodeUnknownSync(
  instanceOf(HTMLInputElement),
)(
  e.currentTarget,
).checked;
