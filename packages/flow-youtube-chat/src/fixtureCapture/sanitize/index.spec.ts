// @vitest-environment happy-dom
import {
  Option as O,
} from 'effect';
import {
  describe,
  expect,
  it,
} from 'vitest';

import sanitize from '@/fixtureCapture/sanitize';
import parseChat from '@/parseChat';

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

describe('sanitize', () => {
  it('anonymizes values while keeping structure, ids and classes', () => {
    const out = sanitize('memberMessage', mount(`
      <yt-live-chat-text-message-renderer author-type="member"
        aria-label="RealName says hi">
        <!-- tracking comment -->
        <script>alert(1)</script>
        <yt-img-shadow id="author-photo" height="24">
          <img src="https://yt3.ggpht.com/Real-Secret_Token9=s64-c-k-no-rj"
            alt="RealName">
        </yt-img-shadow>
        <span id="timestamp">3:47 AM</span>
        <yt-live-chat-author-chip>
          <span id="author-name" class="member style-scope">RealName</span>
        </yt-live-chat-author-chip>
        <span id="message">secret words <img class="emoji"
          src="https://example.com/e.png" alt=":secret:"></span>
      </yt-live-chat-text-message-renderer>`));

    expect(out).not.toContain('RealName');
    expect(out).not.toContain('Real-Secret_Token9');
    expect(out).not.toContain('secret');
    expect(out).not.toContain('aria-label');
    expect(out).not.toContain('author-type');
    expect(out).not.toContain('<script');
    expect(out).not.toContain('<!--');
    expect(out).not.toContain('3:47');
    // Branch forced to ytc/, token canonical, real size suffix kept.
    expect(out).toContain('ggpht.com/ytc/AIdroFakeToken123=s64-c-k-no-rj');
    expect(out).toContain('class="member style-scope"');
    expect(out).toContain('yt-live-chat-author-chip');
    expect(out).toContain('1:23 PM');
  });

  it('produces paid markup that parses to the canonical values', () => {
    const dirty = `
      <yt-live-chat-paid-message-renderer
        style="--yt-live-chat-paid-message-primary-color: rgb(1, 2, 3);">
        <div id="card" class="style-scope yt-live-chat-paid-message-renderer"
          data-tracking="x">
          <div id="header"
            class="style-scope yt-live-chat-paid-message-renderer">
            <yt-img-shadow id="author-photo">
              <img src="https://yt4.ggpht.com/SomeRealToken=s32-c">
            </yt-img-shadow>
            <span id="author-name">Rich Person</span>
            <span id="purchase-amount">£3.00</span>
          </div>
          <div id="content"
            class="style-scope yt-live-chat-paid-message-renderer">
            <span id="message">private thanks</span>
          </div>
        </div>
      </yt-live-chat-paid-message-renderer>`;

    const data = parseChat(mount(sanitize('paidMessage', mount(dirty))));

    expect(data.chatType).toBe('normal');
    expect(data.authorID).toEqual(O.some('PlainToken456'));
    expect(data.paymentInfo).toEqual(O.some('$5.00'));
    expect(data.messageText).toEqual(O.some('Great stream!'));
    expect(data.textColor).toEqual(O.some('rgb(0, 191, 165)'));
    expect(data.paidColor).toEqual(O.some('rgb(29, 233, 182)'));
  });

  it('marks unrecognized author-photo URLs instead of keeping them', () => {
    const out = sanitize('normalMessage', mount(`
      <yt-live-chat-text-message-renderer>
        <yt-img-shadow id="author-photo">
          <img src="https://newcdn.example/avatar/123">
        </yt-img-shadow>
      </yt-live-chat-text-message-renderer>`));

    expect(out).not.toContain('newcdn.example');
    expect(out).toContain('unrecognized-author-photo');
  });
});
