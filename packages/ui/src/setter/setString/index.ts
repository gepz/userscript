import {
  constant,
} from '@effect/data/Function';

import Setter from '@/setter/Setter';

const setString: Setter<string, string> = constant;

export default setString;
