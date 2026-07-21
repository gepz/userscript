// Synthesized minimal fragments of YouTube live-chat renderer markup, one
// per renderer kind parseChat distinguishes. Not verbatim captures: they
// encode the selector contract parseChat relies on (descendant classes named
// after the host renderer tag, polymer-style, plus the #author-photo,
// #author-name, #timestamp, #message, #card, #header, #content and
// purchase-amount ids). When YouTube's markup drifts, refresh the affected
// fragment from a live page's DOM and let the spec arbitrate parseChat.
//
// The spec reads background colors through getComputedStyle, which in
// happy-dom resolves inline styles only for attached elements and returns ''
// for unstyled ones (a real browser returns 'rgba(0, 0, 0, 0)'); every
// element the color lookups touch therefore carries an explicit
// background-color.

export const normalMessage = `
<yt-live-chat-text-message-renderer>
  <yt-img-shadow id="author-photo">
    <img src="https://yt4.ggpht.com/ytc/AIdroFakeToken123=s32-c-k-no-rj">
  </yt-img-shadow>
  <div id="content">
    <span id="timestamp">1:23 PM</span>
    <yt-live-chat-author-chip>
      <span id="author-name">Regular Viewer</span>
    </yt-live-chat-author-chip>
    <span id="message">Hi <img class="emoji" alt=":fish:"> chat</span>
  </div>
</yt-live-chat-text-message-renderer>`;

export const ownerMessage = `
<yt-live-chat-text-message-renderer>
  <div id="content">
    <span id="author-name" class="owner">Streamer</span>
    <span id="message">welcome</span>
  </div>
</yt-live-chat-text-message-renderer>`;

export const moderatorMessage = `
<yt-live-chat-text-message-renderer>
  <div id="content">
    <span id="author-name" class="moderator">Mod</span>
    <span id="message">behave</span>
  </div>
</yt-live-chat-text-message-renderer>`;

export const memberMessage = `
<yt-live-chat-text-message-renderer>
  <div id="content">
    <span id="author-name" class="member">Member</span>
    <span id="message">hello</span>
  </div>
</yt-live-chat-text-message-renderer>`;

export const paidMessage = `
<yt-live-chat-paid-message-renderer>
  <div
    id="card"
    class="style-scope yt-live-chat-paid-message-renderer"
    style="background-color: rgb(29, 233, 182);"
  >
    <div
      id="header"
      class="style-scope yt-live-chat-paid-message-renderer"
      style="background-color: rgb(0, 191, 165);"
    >
      <yt-img-shadow id="author-photo">
        <img src="https://yt3.ggpht.com/PlainToken456=s64-c-k-no-rj">
      </yt-img-shadow>
      <span id="author-name">Generous Viewer</span>
      <span id="purchase-amount">$5.00</span>
      <span id="timestamp">1:24 PM</span>
    </div>
    <div
      id="content"
      class="style-scope yt-live-chat-paid-message-renderer"
      style="background-color: rgb(29, 233, 182);"
    >
      <span id="message">Great stream!</span>
    </div>
  </div>
</yt-live-chat-paid-message-renderer>`;

export const paidSticker = `
<yt-live-chat-paid-sticker-renderer
  style="--yt-live-chat-paid-sticker-chip-background-color: rgb(0, 77, 64);
    --yt-live-chat-paid-sticker-background-color: rgb(0, 121, 107);"
>
  <div id="card" class="style-scope yt-live-chat-paid-sticker-renderer">
    <yt-img-shadow id="author-photo">
      <img src="https://yt4.ggpht.com/ytc/StickerToken789=s32-c-k-no-rj">
    </yt-img-shadow>
    <span id="author-name">Sticker Fan</span>
    <span id="purchase-amount-chip">¥200</span>
  </div>
</yt-live-chat-paid-sticker-renderer>`;

export const membershipItem = `
<yt-live-chat-membership-item-renderer>
  <div id="header" class="style-scope yt-live-chat-membership-item-renderer">
    <yt-img-shadow id="author-photo">
      <img src="https://yt4.ggpht.com/ytc/MemberToken321=s32-c-k-no-rj">
    </yt-img-shadow>
    <span id="author-name" class="member">New Member</span>
    <span id="timestamp">1:25 PM</span>
  </div>
</yt-live-chat-membership-item-renderer>`;

export const tickerPaidMessage = `
<yt-live-chat-ticker-paid-message-item-renderer>
  <div
    id="container"
    class="style-scope yt-live-chat-ticker-paid-message-item-renderer"
  >
    <span id="content">
      <span id="text">$10.00</span>
    </span>
  </div>
</yt-live-chat-ticker-paid-message-item-renderer>`;

export const engagementMessage = `
<yt-live-chat-viewer-engagement-message-renderer>
  <div
    id="content"
    class="style-scope yt-live-chat-viewer-engagement-message-renderer"
  >
    <span id="message">Welcome to live chat!</span>
  </div>
</yt-live-chat-viewer-engagement-message-renderer>`;
