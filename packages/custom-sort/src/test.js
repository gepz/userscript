/* eslint-disable no-console */

let getNearbyNumber = 0;
let teaserDivs = 0;
let logFunc = 0;
let viewsIconSelector = 0;
let likesIconSelector = 0;
let imageFieldSelector = 0;
let galleryIconSelector = 0;
let privateDivSelector = 0;
let getTeaserContainer = 0;

getNearbyNumber = (element) => {
  const parsePrefixed = (str) => Number.parseFloat(str)
   * (str.includes('k') ? 1000 : 1);

  return element ? parsePrefixed(
    element.nextSibling.wholeText.replace(/,/g, ''),
  ) : 0;
};

getTeaserContainer = (node) => {
  const teaserElementSelector = '.node-teaser, .node-sidebar_teaser,'
  + ' .node-wide_teaser';

  const containerSelector = '.views-responsive-grid, .node-playlist'
  + ' .field-name-field-videos';

  return Array.from(node.querySelectorAll(containerSelector))
    .filter((grid) => Boolean(grid.querySelector(teaserElementSelector)));
};

teaserDivs = Array.from(getTeaserContainer(document)[0]
  .querySelectorAll('.clearfix'));

logFunc = (mapFunc) => {
  const items = teaserDivs.map(mapFunc);
  console.log(items.reduce((acc, value) => acc + value));
  const averages = [];
  const itemsPerAverage = 10;
  for (let i = 0; i < items.length / itemsPerAverage; i += 1) {
    let sum = 0;
    for (let j = 0; j < itemsPerAverage; j += 1) {
      sum += items[(i * itemsPerAverage) + j];
    }

    averages.push(sum / itemsPerAverage);
  }

  return averages;
};

viewsIconSelector = '.glyphicon-eye-open';
likesIconSelector = '.glyphicon-heart';
imageFieldSelector = '.field-type-image';
galleryIconSelector = '.glyphicon-th-large';
privateDivSelector = '.private-video';
console.log(logFunc((div) => parseInt(div.dataset.originalIndex, 10)));
console.log(logFunc((div) => getNearbyNumber(
  div.querySelector(viewsIconSelector),
)));

console.log(logFunc((div) => getNearbyNumber(
  div.querySelector(likesIconSelector),
)));

console.log(logFunc((div) => (div.querySelector(imageFieldSelector) ? 1 : 0)));
console.log(logFunc((div) => (div.querySelector(galleryIconSelector) ? 1 : 0)));
console.log(logFunc((div) => (div.querySelector(privateDivSelector) ? 1 : 0)));
console.log(logFunc((div) => getNearbyNumber(
  div.querySelector(likesIconSelector),
)
  / getNearbyNumber(div.querySelector(viewsIconSelector))));
