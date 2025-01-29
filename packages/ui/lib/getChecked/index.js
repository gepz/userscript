import { decodeUnknownSync, } from 'effect/ParseResult';
import { instanceOf, } from 'effect/Schema';
export default (e) => decodeUnknownSync(instanceOf(HTMLInputElement))(e.currentTarget).checked;
//# sourceMappingURL=index.js.map