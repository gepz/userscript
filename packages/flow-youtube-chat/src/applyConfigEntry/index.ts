import {
  Effect as Z,
} from 'effect';

import ConfigEntry from '@/ConfigEntry';
import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';

// Generic in K so the [key, value] correlation survives the setter lookup
// (docs/decisions.md). The entry must stay one value here:
// destructuring it into a separate key and value decouples them into
// independent unions and the setter call stops checking.
export default (
  setter: UserConfigSetter,
) => <K extends keyof UserConfig>(
  entry: ConfigEntry<K>,
): Z.Effect<void> => setter[entry[0]](entry[1]);
