import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  makeExcludedLanes,
} from '@/ExcludedLanes';
import allowedSegments from '@/allowedSegments';

describe('allowedSegments', () => {
  it('spans the whole axis when nothing is excluded', () => {
    expect(allowedSegments(makeExcludedLanes([]), 12)).toEqual([
      {
        start: 0,
        end: 12,
      },
    ]);
  });

  it('splits around an interior excluded lane', () => {
    expect(allowedSegments(makeExcludedLanes([3]), 12)).toEqual([
      {
        start: 0,
        end: 3,
      },
      {
        start: 4,
        end: 12,
      },
    ]);
  });

  it('drops edge excluded lanes instead of emitting empty segments', () => {
    expect(allowedSegments(makeExcludedLanes([0, 11]), 12)).toEqual([
      {
        start: 1,
        end: 11,
      },
    ]);
  });

  it('treats adjacent excluded lanes as one wall', () => {
    expect(allowedSegments(makeExcludedLanes([3, 4]), 12)).toEqual([
      {
        start: 0,
        end: 3,
      },
      {
        start: 5,
        end: 12,
      },
    ]);
  });

  it('keeps single-row segments', () => {
    expect(allowedSegments(makeExcludedLanes([1, 3]), 5)).toEqual([
      {
        start: 0,
        end: 1,
      },
      {
        start: 2,
        end: 3,
      },
      {
        start: 4,
        end: 5,
      },
    ]);
  });

  it('returns no segments when every lane is excluded', () => {
    expect(allowedSegments(makeExcludedLanes([0, 1, 2]), 3)).toEqual([]);
  });

  it('ignores lanes at or beyond laneCount', () => {
    expect(allowedSegments(makeExcludedLanes([5, 12, 20]), 12)).toEqual([
      {
        start: 0,
        end: 5,
      },
      {
        start: 6,
        end: 12,
      },
    ]);
  });
});
