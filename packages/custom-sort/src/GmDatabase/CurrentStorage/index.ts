import {
  GmStorage,
} from '../GmStorage';

export type CurrentStorage = GmStorage<{
  v1: {
    condition: string,
    pageCount: number,
  },
}>;
