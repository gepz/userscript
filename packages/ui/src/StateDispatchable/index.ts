import {
  Effect,
} from 'hyperapp';

type StateDispatchable<S> = [s: S, ...e: Effect<S>[]];

export type {
  StateDispatchable as default,
};
