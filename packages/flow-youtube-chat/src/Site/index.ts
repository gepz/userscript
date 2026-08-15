import {
  Effect as Z,
} from 'effect';

import ChatData from '@/ChatData';
import LivePage from '@/LivePage';

// The site-specific half of the overlay: every read of, and edit to, a
// streaming site's own markup that the rest of src/ would otherwise do
// inline. Everything else works from ChatData, UserConfig and the elements
// LivePage hands it, so supporting a second site is writing one more of
// these and registering it in @/sites — nothing downstream of the parse
// should learn the site's name.
//
// Not yet behind this seam, and so still YouTube-only: ChatData's chatType
// vocabulary (its membership/gift/engagement cases), the class names
// @/banButton and @/mainCss borrow for styling, and the fixture-capture
// tooling under @/fixtureCapture, which targets YouTube markup by
// definition. See the "Per site settings" entry in docs/backlog.md.
export default interface Site {
  // Whether this adapter recognizes the page the script was injected into,
  // consulted once at startup. It picks between adapters rather than
  // gating: the @match header is what keeps the script off other sites, so
  // a page no adapter claims still gets @/sites' first entry.
  matches: () => boolean
  // Where the overlay's anchor elements live on this site.
  page: LivePage
  // One chat renderer's markup, read into the site-agnostic shape.
  parseChat: (chat: HTMLElement) => ChatData
  // Which element inside a chat renderer the ban button attaches to, or
  // null for a renderer that has no place for one. Whatever it returns must
  // satisfy the constraint documented at @/appendChatMessage.
  banButtonAnchor: (chat: HTMLElement) => Element | null
  // What the "Simplify chat field" toggle does to one chat renderer.
  simplifyChat: (chat: HTMLElement) => Z.Effect<void>
  // Selects the chat list's scrolling ancestor from a chat inside it; see
  // @/isAboveVisibleTail for the geometry this feeds.
  chatScrollerSelector: string
}
