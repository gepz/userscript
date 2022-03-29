export type TypeKey<T1, T2> = { [K in keyof T1]: T1[K] extends T2 ? K
  : never }[keyof T1];
