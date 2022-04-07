import {
  tapIs,
} from '@userscript/tap/lib';

export default (e: Event): boolean => tapIs(HTMLInputElement)(
  e.currentTarget,
).checked;
