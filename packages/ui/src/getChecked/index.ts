import {
  decodeUnknownSync,
} from 'effect/ParseResult';
import {
  instanceOf,
} from 'effect/Schema';

export default (e: Event): boolean => decodeUnknownSync(
  instanceOf(HTMLInputElement),
)(
  e.currentTarget,
).checked;
