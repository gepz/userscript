import * as log from 'loglevel';

import initialize from '@/initialize';

(async () => {
  log.setLevel('debug');
  try {
    await initialize();
  } catch (error) {
    log.error(error);
  }
})();
