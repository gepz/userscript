import {
  Array as A,
  Cause,
  Effect as Z,
  String as Str,
  SubscriptionRef,
  pipe,
} from 'effect';
import deepEq from 'fast-deep-equal';

import ConfigRefs from '@/ConfigRefs';
import UserConfig from '@/UserConfig';
import UserConfigSetter from '@/UserConfigSetter';
import setterFromKeysAndMap from '@/setterFromKeysAndMap';

/**
 * The single write path for config values. A banned-list write also
 * rebuilds filterExp through the full setConfig path (broadcast +
 * persist) whenever the rebuild changes it. The dedup in
 * `setChangedConfig` and `setConfig` — not any locality check — is what
 * keeps BroadcastChannel writes from looping.
 */
export default ({
  configValue,
  configRefs,
  configKeys,
  dispatchToSettings,
  broadcastAndPersist,
  defaultFilterExp,
}: {
  configValue: UserConfig
  configRefs: ConfigRefs
  configKeys: (keyof UserConfig)[]
  dispatchToSettings: <K extends keyof UserConfig>(
    key: K,
  ) => (val: UserConfig[K]) => Z.Effect<void>
  broadcastAndPersist: <K extends keyof UserConfig>(
    key: K,
  ) => (val: UserConfig[K]) => Z.Effect<void>
  defaultFilterExp: () => UserConfig['filterExp']
}): {
  setConfigPlain: UserConfigSetter
  setChangedConfig: UserConfigSetter
  setConfig: UserConfigSetter
} => {
  const writeBase = <K extends keyof UserConfig>(
    key: K,
  ) => (val: UserConfig[K]): Z.Effect<void> => pipe(
    Z.sync(() => {
      Object.assign(configValue, {
        [key]: val,
      });
    }),
    Z.zipRight(SubscriptionRef.set(configRefs[key], val)),
  );

  // Full setConfig for filterExp alone, composed from the base pieces: the
  // banned-list hook below needs it while the general setConfig is itself
  // built on top of that hook.
  const setFilterExpFull = (val: UserConfig['filterExp']): Z.Effect<void> => (
    pipe(
      Z.sync(() => configValue.filterExp),
      Z.filterOrFail((x) => !deepEq(x, val)),
      Z.flatMap(() => pipe(
        writeBase('filterExp')(val),
        Z.zipRight(dispatchToSettings('filterExp')(val)),
      )),
      Z.zipRight(broadcastAndPersist('filterExp')(val)),
      Z.ignore,
    )
  );

  const onConfigWrite = <K extends keyof UserConfig>(
    key: K,
  ) => (val: UserConfig[K]): Z.Effect<void> => pipe(
    dispatchToSettings(key)(val),
    Z.zipRight(pipe(
      [
        'bannedWords',
        'bannedUsers',
        'bannedWordRegexes',
      ] as const,
      A.containsWith(Str.Equivalence)(key),
      (x) => (x
        // Suspended so the default filter is computed at run time, after
        // writeBase has stored the new banned list it derives from.
        ? Z.suspend(() => setFilterExpFull(defaultFilterExp()))
        : Z.void),
    )),
  );

  const setterFromMap = setterFromKeysAndMap(configKeys);

  const setConfigPlain = setterFromMap(
    (key) => (val) => pipe(
      writeBase(key)(val),
      Z.zipRight(onConfigWrite(key)(val)),
    ),
  );

  const changedConfigMap = <K extends keyof UserConfig>(
    key: K,
  ) => (
    val: UserConfig[K],
  ): Z.Effect<unknown, Cause.NoSuchElementException> => pipe(
    Z.sync(() => configValue[key]),
    Z.filterOrFail((x) => !deepEq(x, val)),
    Z.flatMap(() => setConfigPlain[key](val)),
  );

  return {
    setConfigPlain,
    setChangedConfig: setterFromMap(
      (key) => (val) => changedConfigMap(key)(val).pipe(Z.ignore),
    ),
    setConfig: setterFromMap(
      (key) => (val) => changedConfigMap(key)(val).pipe(
        Z.zipRight(broadcastAndPersist(key)(val)),
        Z.ignore,
      ),
    ),
  };
};
