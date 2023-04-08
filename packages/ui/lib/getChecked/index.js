import { z, } from 'zod';
export default (e) => z.instanceof(HTMLInputElement).parse(e.currentTarget).checked;
//# sourceMappingURL=index.js.map