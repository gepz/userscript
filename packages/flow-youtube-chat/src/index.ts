import {
  Effect as Z,
  pipe,
} from 'effect';

import initialize from '@/initialize';
import runLogged from '@/runLogged';

runLogged(pipe(
  initialize,
  Z.withConcurrency(30),
));
