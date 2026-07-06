import {
  describe,
  expect,
  it,
} from 'vitest';

import configDiff from '@/configDiff';

describe('configDiff', () => {
  it('diffs object roots per key', () => {
    expect(configDiff({
      a: 1,
      b: 2,
    }, {
      a: 1,
      b: 3,
    })).toEqual([
      {
        type: 'CHANGE',
        path: ['b'],
        oldValue: 2,
        value: 3,
      },
    ]);
  });

  it('diffs array roots per index', () => {
    expect(configDiff(['x'], ['x', 'y'])).toEqual([
      {
        type: 'CREATE',
        path: [1],
        value: 'y',
      },
    ]);
  });

  it('reports primitive roots as a single root-level change', () => {
    expect(configDiff(1, 2)).toEqual([
      {
        type: 'CHANGE',
        path: [],
        oldValue: 1,
        value: 2,
      },
    ]);
  });

  it('reports null roots as a root-level change', () => {
    expect(configDiff(null, {})).toEqual([
      {
        type: 'CHANGE',
        path: [],
        oldValue: null,
        value: {},
      },
    ]);
  });
});
