import AppTextGetter from '@userscript/ui/appNode/AppTextGetter';
import {
  Array as A,
  Option as O,
  pipe,
} from 'effect';

import TextKey from '@/TextKey';
import defaultText from '@/defaultText';
import languages from '@/languages';

interface State {
  lang: typeof languages[number],
}
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions

export default ((key: TextKey) => (
  state: State,
): string => pipe(
  languages,
  A.findFirstIndex((x) => x === state.lang),
  O.map((x) => A.unsafeGet(defaultText[key], x)),
  O.getOrElse(() => 'Error'),
)
)satisfies AppTextGetter<TextKey, State>;
