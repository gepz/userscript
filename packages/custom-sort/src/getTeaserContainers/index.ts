import teaserElementSelector from '@/teaserElementSelector';

export default (node: HTMLDocument): HTMLElement[] => {
  const containerSelector = '.views-responsive-grid, .node-playlist'
  + ' .field-name-field-videos';

  return Array.from(node.querySelectorAll<HTMLElement>(containerSelector))
    .filter((grid) => grid.querySelector(teaserElementSelector));
};
