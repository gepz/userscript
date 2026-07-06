import {
  Effect as Z,
  Fiber,
  Stream,
  pipe,
} from 'effect';
import jsep from 'jsep';
import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import ConfigRefs from '@/ConfigRefs';
import UserConfig from '@/UserConfig';
import configWriteFunnel from '@/configWriteFunnel';
import makeRefs from '@/stream/makeRefs';

// The funnel only touches the keys it is given plus filterExp, so a
// three-key slice of UserConfig is enough for behavior tests.
/* eslint-disable @typescript-eslint/consistent-type-assertions */
const testKeys = [
  'fieldScale',
  'bannedWords',
  'filterExp',
] as (keyof UserConfig)[];

const makeFixture = () => {
  const configValue = {
    fieldScale: 1,
    bannedWords: ['initial'],
    filterExp: jsep('true'),
  } as unknown as UserConfig;

  const calls: string[] = [];
  const record = (tag: string) => <K extends keyof UserConfig>(
    key: K,
  ) => () => Z.sync(() => {
    calls.push(`${tag}:${key}`);
  });

  return Z.map(
    makeRefs(configValue),
    (refs) => ({
      configValue,
      calls,
      refs,
      funnel: configWriteFunnel({
        configValue,
        configRefs: refs as ConfigRefs,
        configKeys: testKeys,
        dispatchToSettings: record('dispatch'),
        broadcastAndPersist: record('broadcast'),
        defaultFilterExp: () => jsep(
          `bannedWords includes ${JSON.stringify(configValue.bannedWords)}`
            .replaceAll(/[^\sA-Za-z]/gu, ''),
        ),
      }),
    }),
  );
};
/* eslint-enable @typescript-eslint/consistent-type-assertions */

describe('configWriteFunnel', () => {
  let fixture: Z.Effect.Success<ReturnType<typeof makeFixture>>;

  beforeEach(async () => {
    fixture = await Z.runPromise(makeFixture());
  });

  it('mutates configValue before emitting on the ref (W1)', async () => {
    // eslint-disable-next-line func-names
    await Z.runPromise(Z.gen(function* () {
      const snapshots: [unknown, unknown][] = [];
      const fiber = yield * pipe(
        fixture.refs.fieldScale.changes,
        Stream.take(2),
        Stream.runForEach((emitted) => Z.sync(() => {
          snapshots.push([emitted, fixture.configValue.fieldScale]);
        })),
        Z.fork,
      );

      yield * Z.sleep('10 millis');
      yield * fixture.funnel.setConfigPlain.fieldScale(2);
      yield * Fiber.join(fiber);

      expect(snapshots).toEqual([[1, 1], [2, 2]]);
    }));
  });

  it('runs write side effects once per write, not per subscriber', async () => {
    // eslint-disable-next-line func-names
    await Z.runPromise(Z.gen(function* () {
      const consume = pipe(
        fixture.refs.fieldScale.changes,
        Stream.take(2),
        Stream.runDrain,
        Z.fork,
      );

      const first = yield * consume;
      const second = yield * consume;

      yield * Z.sleep('10 millis');
      yield * fixture.funnel.setConfigPlain.fieldScale(2);
      yield * Fiber.join(first);
      yield * Fiber.join(second);

      expect(fixture.calls).toEqual(['dispatch:fieldScale']);
    }));
  });

  it('rebuilds filterExp through the full path on banned-list writes', () => (
    // eslint-disable-next-line func-names
    Z.runPromise(Z.gen(function* () {
      yield * fixture.funnel.setConfigPlain.bannedWords(['x']);

      expect(fixture.calls).toEqual([
        'dispatch:bannedWords',
        'dispatch:filterExp',
        'broadcast:filterExp',
      ]);

      expect(fixture.configValue.filterExp).toEqual(
        jsep('bannedWords includes x'),
      );
    }))
  ));

  it('skips the filterExp rebuild when it is unchanged', () => (
    // eslint-disable-next-line func-names
    Z.runPromise(Z.gen(function* () {
      yield * fixture.funnel.setConfigPlain.bannedWords(['x']);
      yield * fixture.funnel.setConfigPlain.bannedWords(['x']);

      expect(fixture.calls).toEqual([
        'dispatch:bannedWords',
        'dispatch:filterExp',
        'broadcast:filterExp',
        'dispatch:bannedWords',
      ]);
    }))
  ));

  it('setConfig dedups unchanged values: no effects, no emission (W2)', () => (
    // eslint-disable-next-line func-names
    Z.runPromise(Z.gen(function* () {
      yield * fixture.funnel.setConfig.fieldScale(1);

      expect(fixture.calls).toEqual([]);
      expect(fixture.configValue.fieldScale).toBe(1);
    }))
  ));

  it('setChangedConfig writes locally without broadcasting (W3)', () => (
    // eslint-disable-next-line func-names
    Z.runPromise(Z.gen(function* () {
      yield * fixture.funnel.setChangedConfig.fieldScale(3);

      expect(fixture.calls).toEqual(['dispatch:fieldScale']);
      expect(fixture.configValue.fieldScale).toBe(3);
    }))
  ));

  it('setConfig writes, dispatches, then broadcasts, in order (W4)', () => (
    // eslint-disable-next-line func-names
    Z.runPromise(Z.gen(function* () {
      yield * fixture.funnel.setConfig.fieldScale(4);

      expect(fixture.calls).toEqual([
        'dispatch:fieldScale',
        'broadcast:fieldScale',
      ]);

      expect(fixture.configValue.fieldScale).toBe(4);
    }))
  ));
});
