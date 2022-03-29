import {
  GmStorage,
} from '../GmStorage';

export type LegacyStorage = GmStorage<{
  sortValue: string,
  pageCount: number,
}>;
