import {
  z,
} from 'zod';

import reservedKeys from '../reservedKeys';

const optionalNumber = z.optional(z.number());

export default async (): Promise<number | undefined> => optionalNumber.parse(
  await GM.getValue(reservedKeys.version),
);
