import { instanceOf, decodeUnknownSync, } from 'effect/Schema';
export default (e) => decodeUnknownSync(instanceOf(HTMLInputElement))(e.currentTarget).checked;
//# sourceMappingURL=index.js.map