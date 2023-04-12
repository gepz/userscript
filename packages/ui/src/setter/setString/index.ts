import {
  constant,
  flow,
  identity,
} from '@effect/data/Function';

import Setter from '@/setter/Setter';

const setString: Setter<string, string> = flow(
  identity,
  constant,
);

export default setString;
