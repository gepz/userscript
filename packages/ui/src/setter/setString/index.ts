import {
  constant,
} from 'effect/Function';

import Setter from '@/setter/Setter';

const setString: Setter<string, string> = constant;

export default setString;
