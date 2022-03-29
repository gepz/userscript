import * as log from 'loglevel';

import initialize from '@/initialize';

(async () => {
  // log.setLevel('debug');
  log.setLevel('info');
  try {
    await initialize();
  } catch (error) {
    log.info('【FYC】 Error', error);
  }
})();
