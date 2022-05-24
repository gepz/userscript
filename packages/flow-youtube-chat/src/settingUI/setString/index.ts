import {
  constant,
  flow,
  identity,
} from 'fp-ts/function';

export default flow(
  identity,
  constant,
);
