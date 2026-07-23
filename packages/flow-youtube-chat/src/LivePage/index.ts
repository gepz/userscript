import {
  Effect as Z,
  Cause,
} from 'effect';

export default interface LivePage {
  chatField: Z.Effect<HTMLElement, Cause.NoSuchElementException>
  // The flow sources chats from chatField alone (see @/allStream); the
  // ticker is looked up only for the fixture capture tooling.
  chatTicker: Z.Effect<HTMLElement, Cause.NoSuchElementException>
  chatScroller: Z.Effect<HTMLElement, Cause.NoSuchElementException>
  video: Z.Effect<HTMLVideoElement, Cause.NoSuchElementException>
  player: Z.Effect<Element, Cause.NoSuchElementException>
  toggleChatBtnParent: Z.Effect<Element, Cause.NoSuchElementException>
  settingsToggleNextElement: Z.Effect<Element, Cause.NoSuchElementException>
  settingsContainer: Z.Effect<Element, Cause.NoSuchElementException>
  offlineSlate: Z.Effect<Element, Cause.NoSuchElementException>
}
