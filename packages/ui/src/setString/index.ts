import {
  LazyArg,
  constant,
  flow,
  identity,
} from '@effect/data/Function';

const setString: <A>(a: A) => LazyArg<A> = flow(
  identity,
  constant,
);

export default setString;
