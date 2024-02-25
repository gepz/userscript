import {
  IsEqual,
} from 'type-fest';

type ExactTypeKey<O, Type> = {
  [K in keyof O]: IsEqual<O[K], Type> extends true ? K : never
}[keyof O];

export default ExactTypeKey;

