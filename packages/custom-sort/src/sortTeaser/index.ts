import {
  tapNonNull,
} from '@userscript/tap';
import * as O from 'fp-ts/Option';
import {
  pipe,
} from 'fp-ts/function';

import teaserElementSelector from '@/teaserElementSelector';

import {
  TeaserInfo,
} from './TeaserInfo';

const getTeaserValue = (info: TeaserInfo, condition: string) => {
  const sortParamPairs = [
    ['index', info.initialIndex],
    ['views', info.viewCount],
    ['likes', info.likeCount],
    ['ratio', Math.min(info.likeCount / Math.max(1, info.viewCount), 1)],
    ['image', info.imageFactor],
    ['gallery', info.galleryFactor],
    ['private', info.privateFactor],
  ] as const;

  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
  return new Function(
    ...sortParamPairs.map(([name]) => name),
    `return (${condition})`,
  )(...sortParamPairs.map((pair) => pair[1]));
};

export default (
  container: HTMLElement,
  condition: string,
): void => {
  const viewsIconSelector = '.glyphicon-eye-open';
  const likesIconSelector = '.glyphicon-heart';
  const imageFieldSelector = '.field-type-image';
  const galleryIconSelector = '.glyphicon-th-large';
  const privateDivSelector = '.private-video';
  const teaserDivs = Array.from(container.querySelectorAll<HTMLElement>(
    teaserElementSelector,
  ));

  const sortedTeaserCount = container.dataset.sortedTeaserCount
    ? parseInt(container.dataset.sortedTeaserCount, 10)
    : 0;

  teaserDivs.filter(({
    dataset,
  }) => !dataset.initialIndex)
    .forEach(({
      dataset,
    }, index) => {
      dataset.initialIndex = (sortedTeaserCount + index).toString();
    });

  container.dataset.sortedTeaserCount = teaserDivs.length.toString();

  const getNearbyNumber = (element: Element) => {
    const parseSuffixed = (str: string) => Number.parseFloat(str) * (
      str.includes('k') ? 1000 : 1);

    // Use type assertion becuase cross browing context
    return parseSuffixed(
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      (element.nextSibling as Text).wholeText.replace(/,/g, ''),
    );
  };

  const nearbyNumberOrZero = (element: Element | null) => pipe(
    O.fromNullable(element),
    O.map(getNearbyNumber),
    O.getOrElse(() => 0),
  );

  const teaserInfos = teaserDivs.map((div): TeaserInfo => ({
    initialIndex: parseInt(tapNonNull(div.dataset.initialIndex), 10),
    viewCount: nearbyNumberOrZero(div.querySelector(viewsIconSelector)),
    likeCount: nearbyNumberOrZero(div.querySelector(likesIconSelector)),
    imageFactor: div.querySelector(imageFieldSelector) ? 1 : 0,
    galleryFactor: div.querySelector(galleryIconSelector) ? 1 : 0,
    privateFactor: div.querySelector(privateDivSelector) ? 1 : 0,
  }));

  const divValuePairs = teaserInfos.map(
    (info, index) => [
      teaserDivs[index],
      getTeaserValue(info, condition),
    ] as const,
  );

  divValuePairs.sort((itemA, itemB) => itemB[1] - itemA[1]);
  teaserDivs.forEach((div) => div.after(document.createElement('span')));
  teaserDivs.map((div) => tapNonNull(div.nextSibling)).forEach(
    (anchor, index) => anchor.replaceWith(divValuePairs[index][0]),
  );
};
