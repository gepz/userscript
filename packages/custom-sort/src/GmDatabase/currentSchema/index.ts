import {
  CurrentStorage,
} from '../CurrentStorage';
import {
  GmDatabaseSchema,
} from '../GmDatabaseSchema';
import {
  LegacyStorage,
} from '../LegacyStorage';

const currentSchema: GmDatabaseSchema<[LegacyStorage, CurrentStorage]> = [
  {
    defaultStorage: {
      sortValue: '',
      pageCount: 0,
    },
  },
  {
    upgradeAlias: {
      v1: {
        condition: ['sortValue'],
      },
    },
    defaultStorage: {
      v1: {
        condition: '',
        pageCount: 0,
      },
    },
  },
];

export default currentSchema;
