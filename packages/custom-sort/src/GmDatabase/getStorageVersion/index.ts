import assert from '@userscript/assert';

import reservedKeys from '../reservedKeys';

export default async (): Promise<number | undefined> => {
  const value = await GM.getValue(reservedKeys.version);
  assert(typeof value === 'number' || typeof value === 'undefined');
  return value;
};
