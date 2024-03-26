import {
  decodeUnknownSync,
} from '@effect/schema/ParseResult';
import {
  instanceOf,
} from '@effect/schema/Schema';

export default (e: Event): boolean => decodeUnknownSync(
  instanceOf(HTMLInputElement),
)(
  e.currentTarget,
).checked;
