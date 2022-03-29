import {
  GmDatabaseSchema,
} from '../GmDatabaseSchema';
import {
  GmStorage,
} from '../GmStorage';
import getStorageVersion from '../getStorageVersion';
import setStorageVersion from '../setStorageVersion';

export default async <T extends GmStorage[]>(
  schema: GmDatabaseSchema<T>,
): Promise<void> => {
  const version = await getStorageVersion() ?? 0;
  if (version < schema.length) {
    setStorageVersion(schema.length);
  }
};
