import * as log from 'loglevel';

import initChild from '@/initChild';
import initParent from '@/initParent';

export default async (): Promise<void> => {
  const isParent = (window === window.parent);
  log.debug(`${isParent ? 'Parent' : 'Child'}: ${window.location.href}`);
  await (isParent ? initParent() : initChild());
};
