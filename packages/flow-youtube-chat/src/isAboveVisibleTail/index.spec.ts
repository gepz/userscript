// @vitest-environment happy-dom
import {
  describe,
  expect,
  it,
} from 'vitest';

import isAboveVisibleTail from '@/isAboveVisibleTail';

// happy-dom performs no layout, so geometry is stubbed per element.
const withRect = <T extends HTMLElement>(element: T, bottom: number): T => {
  element.getBoundingClientRect = () => new DOMRect(0, bottom - 30, 400, 30);

  return element;
};

const scrollerSelector = '#item-scroller';

// #item-scroller > #item-offset > #items > chat, as in live markup.
const mountChat = (
  listBottom: number,
  chatBottom: number,
): HTMLElement => {
  const scroller = document.createElement('div');

  scroller.id = 'item-scroller';
  Object.defineProperty(scroller, 'clientHeight', {
    value: 600,
  });

  const offset = document.createElement('div');

  offset.id = 'item-offset';

  const items = withRect(document.createElement('div'), listBottom);

  items.id = 'items';

  const chat = withRect(document.createElement('div'), chatBottom);

  items.append(chat);
  offset.append(items);
  scroller.append(offset);
  document.body.append(scroller);

  return chat;
};

describe('isAboveVisibleTail', () => {
  const verdict = (
    listBottom: number,
    chatBottom: number,
  ): boolean => isAboveVisibleTail(
    mountChat(listBottom, chatBottom),
    scrollerSelector,
  );

  it('is true for a chat more than a viewport above the list end', () => {
    expect(verdict(1000, 100)).toBe(true);
  });

  it('is false for a chat within the last viewport of the list', () => {
    expect(verdict(1000, 950)).toBe(false);
  });

  it('is false at exactly one viewport from the list end', () => {
    expect(verdict(1000, 400)).toBe(false);
  });

  it('is unaffected by translating the whole list', () => {
    // A rebuild's transient scroll states shift every box equally; the
    // verdict must not change with them.
    expect(verdict(-8000, -8900)).toBe(true);
    expect(verdict(12000, 11950)).toBe(false);
  });

  it('fails open without a scroller ancestor', () => {
    const items = withRect(document.createElement('div'), 1000);
    const chat = withRect(document.createElement('div'), 100);

    items.append(chat);
    document.body.append(items);
    expect(isAboveVisibleTail(chat, scrollerSelector)).toBe(false);
  });

  it('is true for a detached chat', () => {
    const items = withRect(document.createElement('div'), 1000);
    const chat = withRect(document.createElement('div'), 950);

    items.append(chat);
    expect(isAboveVisibleTail(chat, scrollerSelector)).toBe(true);
  });
});
