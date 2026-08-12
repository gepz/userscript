import {
  Effect as Z,
} from 'effect';
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  makeExcludedLanes,
} from '@/ExcludedLanes';
import defaultGMConfig from '@/defaultGMConfig';

const item = defaultGMConfig.excludedLanes;

const decode = (stored: GM.Value): Promise<readonly number[]> => {
  vi.stubGlobal('GM', {
    getValue: () => Promise.resolve(stored),
  });

  return Z.runPromise(item.getValue);
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('excludedLanes codec', () => {
  it('round-trips an excluded set', async () => {
    const excluded = makeExcludedLanes([0, 5, 11]);

    expect(await decode(item.toGm(excluded))).toEqual(excluded);
  });

  it('round-trips the empty set', async () => {
    expect(await decode(item.toGm(makeExcludedLanes([])))).toEqual([]);
  });

  it('normalizes to sorted deduped lanes', async () => {
    expect(await decode('5,1,5,3')).toEqual([1, 3, 5]);
  });

  it('drops fragments that are not non-negative integers', async () => {
    expect(await decode('2,x,-1,3.5,,4')).toEqual([2, 4]);
  });

  it('falls back to the default on a non-string store', async () => {
    expect(await decode(42)).toEqual([]);
  });
});
