import {
  constant,
  flow,
  identity,
} from '@effect/data/Function';

export default flow(
  identity,
  constant,
);
