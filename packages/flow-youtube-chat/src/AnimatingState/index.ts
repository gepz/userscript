import {
  Either as E,
} from 'effect';

type AnimatingState = E.Either<Animation, 'NotStarted' | 'Ended'>;

export default AnimatingState;
