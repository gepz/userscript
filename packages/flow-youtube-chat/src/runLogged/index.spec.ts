import {
  Effect as Z,
  LogLevel,
} from 'effect';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import logWithMeta from '@/logWithMeta';
import runLogged from '@/runLogged';

describe('runLogged', () => {
  it('routes, suppresses, and appends meta like the old provideLog stack', async () => {
    const calls: unknown[][] = [];
    const spies = (['trace', 'debug', 'info', 'warn', 'error', 'log'] as const)
      .map((m) => vi.spyOn(console, m).mockImplementation((...args) => {
        calls.push([m, ...args]);
      }));

    await runLogged(Z.logDebug('quiet'));
    await runLogged(Z.logWarning('loud'));
    await runLogged(logWithMeta(LogLevel.Debug)('meta msg')({
      a: 1,
    }));

    await expect(runLogged(Z.die(new Error('boom')))).rejects.toThrow();

    spies.forEach((s) => {
      s.mockRestore();
    });

    expect(calls).toEqual([
      // Sub-Warning entries without meta are suppressed, hence no 'quiet'.
      ['warn', '[FYC] loud'],
      [
        'debug', '[FYC] meta msg: ', {
          a: 1,
        },
      ],
      ['error', expect.stringContaining('boom')],
    ]);
  });
});
