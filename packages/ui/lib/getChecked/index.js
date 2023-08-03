import { parseSync, } from '@effect/schema/Parser';
import { instanceOf, } from '@effect/schema/Schema';
export default (e) => parseSync(instanceOf(HTMLInputElement))(e.currentTarget).checked;
//# sourceMappingURL=index.js.map