export type ExtendProperty<T1, T2 = Record<string, T1>> = T2 extends
Record<keyof T2, T1> ? T2 : never;
