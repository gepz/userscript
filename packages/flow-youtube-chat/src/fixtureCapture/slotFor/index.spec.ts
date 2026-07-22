// @vitest-environment happy-dom
import {
  Option as O,
} from 'effect';
import {
  readFileSync,
} from 'node:fs';
import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  slots,
  type Slot,
} from '@/fixtureCapture/Slot';
import slotFor from '@/fixtureCapture/slotFor';

// cwd-relative because import.meta.url is an http URL under happy-dom.
const fixture = (name: Slot): string => readFileSync(
  `src/parseChat/fixtures/${name}.html`,
  'utf8',
);

const mount = (html: string): HTMLElement => {
  const host = document.createElement('div');

  document.body.append(host);
  host.innerHTML = html;
  const chat = host.firstElementChild;

  if (!(chat instanceof HTMLElement)) {
    throw new Error('Markup has no root element');
  }

  return chat;
};

describe('slotFor', () => {
  // Self-consistency of the capture loop: every fixture must classify back
  // to its own slot, or a capture would overwrite the wrong file.
  it.each([...slots].map((slot) => ({
    slot,
  })))('maps the $slot fixture to its own slot', ({
    slot,
  }) => {
    expect(slotFor(mount(fixture(slot)))).toEqual(O.some(slot));
  });

  it('ignores renderer kinds the fixtures do not model', () => {
    expect(slotFor(mount(
      '<yt-live-chat-placeholder-item-renderer>'
      + '</yt-live-chat-placeholder-item-renderer>',
    ))).toEqual(O.none());
  });
});
