import { decodeUnknownSync, } from '@effect/schema/Parser';
import { instanceOf, } from '@effect/schema/Schema';
export default (e) => decodeUnknownSync(instanceOf(HTMLInputElement))(e.currentTarget).checked;
//# sourceMappingURL=index.js.map