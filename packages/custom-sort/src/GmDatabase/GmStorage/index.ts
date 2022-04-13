import {
  ExtendProperty,
} from '../ExtendProperty';
import {
  GmTable,
} from '../GmTable';

type GmStorageField = GmTable | GM.Value;

export type GmStorage<
  T = ExtendProperty<GmStorageField>,
> = ExtendProperty<GmStorageField, T>;
