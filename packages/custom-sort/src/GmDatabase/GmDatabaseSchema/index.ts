import {
  O,
} from 'ts-toolbelt';
import {
  PartialDeep,
} from 'type-fest';

import {
  GmStorage,
} from '../GmStorage';
import {
  GmTable,
} from '../GmTable';

type UpgradeAlias<
  T extends GmStorage,
  U extends GmStorage,
> = PartialDeep<{
  [Key in keyof U]: U[Key] extends GmTable
    ? Record<keyof U[Key], O.Paths<T>>
    : O.Paths<T>;
}>;

type StoragePairs<
  T extends [(GmStorage | undefined), ...GmStorage[]],
> = T extends [infer U, ...infer V] ?
  V extends [GmStorage, ...GmStorage[]] ?
    [[U, V[0]], ...StoragePairs<V>]
    : []
  : never;

type StoragePair = [GmStorage | undefined, GmStorage];

type Schema<T extends StoragePair[]> = T extends [infer U extends StoragePair, ... infer V extends StoragePair[]] ?
  [
    {
      upgradeAlias?: U[0] extends GmStorage ?
        UpgradeAlias<GmStorage<U[0]>, GmStorage<U[1]>>
        : never,
      defaultStorage: GmStorage<U[1]>,
    },
    ...Schema<V>,
  ]
  : T extends [] ? []
  : never;

export type GmDatabaseSchema<
  T extends GmStorage[],
> = Schema<StoragePairs<[undefined, ...T]>>;
