import {
  ConditionalKeys,
} from 'type-fest';

type NoOverlapKeys<T1, T2> = keyof T1 & keyof T2 extends never
  ? keyof T1 | keyof T2 : never;

type AppPropertyKeys<
  State,
  Computed,
  T> = NoOverlapKeys<State, Computed> extends never
    ? never
    : ConditionalKeys<State, T> | ConditionalKeys<Computed, (s: State) => T>;

export default AppPropertyKeys;
