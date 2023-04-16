import TextGetter from '@userscript/ui/TextGetter';

import TextKey from '@/TextKey';
import defaultText from '@/defaultText';
import languages from '@/languages';

interface State {
  lang: typeof languages[number],
}

export default ((key: TextKey) => (
  state: State,
): string => defaultText[key][
  state.lang === 'FYC_EN' ? 0
  : 1
]) satisfies TextGetter<TextKey, State>;
