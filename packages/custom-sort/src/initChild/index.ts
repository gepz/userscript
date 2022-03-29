import {
  tapNonNull,
} from '@userscript/tap';
import {
  BroadcastChannel,
} from 'broadcast-channel';
import delay from 'delay';
import {
  pipe,
} from 'fp-ts/function';

import PageLoadedMessage from '@/PageLoadedMessage';
import getTeaserContainers from '@/getTeaserContainers';
import scriptIdentifier from '@/scriptIdentifier';

const addContainersToParents = (
  children: Element[],
  parents: Element[],
) => {
  for (
    let i = 0, j = 0;
    i < parents.length && j < children.length;
    i += 1
  ) {
    const parent = parents[i];
    const child = children[j];
    if (parent.className === child.className) {
      child.className = '';
      parent.append(child);
      j += 1;
    }
  }
};

export default async (): Promise<void> => {
  const teaserContainers = getTeaserContainers(document);
  const channel = new BroadcastChannel(scriptIdentifier);
  const hasTeasers = teaserContainers.length > 0;
  const message: PageLoadedMessage = {
    url: window.location.href,
    parentPageId: Array.from(
      tapNonNull(window.frameElement).classList,
    ).filter((x) => x.startsWith('t-'))[0],
    hasTeasers,
  };

  if (hasTeasers) {
    await delay(500);
    addContainersToParents(
      teaserContainers,
      pipe(
        window.parent?.document,
        (x) => (x ? getTeaserContainers(x) : []),
      ),
    );
  }

  channel.postMessage(message);
};
