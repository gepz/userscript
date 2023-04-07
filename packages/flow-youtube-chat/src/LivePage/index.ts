import * as Cause from '@effect/io/Cause';
import * as Z from '@effect/io/Effect';

export default interface LivePage {
  chatField: Z.Effect<never, Cause.NoSuchElementException, HTMLElement>,
  chatTicker: Z.Effect<never, Cause.NoSuchElementException, HTMLElement>,
  chatScroller: Z.Effect<never, Cause.NoSuchElementException, HTMLElement>,
  video: Z.Effect<never, Cause.NoSuchElementException, HTMLVideoElement>,
  player: Z.Effect<never, Cause.NoSuchElementException, Element>,
  toggleChatBtnParent: Z.Effect<never, Cause.NoSuchElementException, Element>,
  settingsToggleNextElement: Z.Effect<
  never,
  Cause.NoSuchElementException,
  Element
  >,
  settingsContainer: Z.Effect<never, Cause.NoSuchElementException, Element>,
  offlineSlate : Z.Effect<never, Cause.NoSuchElementException, Element>,
}
