import * as O from '@effect/data/Option';
import * as Z from '@effect/io/Effect';

export default interface LivePage {
  chatField: Z.Effect<never, O.Option<never>, HTMLElement>,
  chatTicker: Z.Effect<never, O.Option<never>, HTMLElement>,
  chatScroller: Z.Effect<never, O.Option<never>, HTMLElement>,
  video: Z.Effect<never, O.Option<never>, HTMLVideoElement>,
  player: Z.Effect<never, O.Option<never>, Element>,
  toggleChatBtnParent: Z.Effect<never, O.Option<never>, Element>,
  settingsToggleNextElement: Z.Effect<never, O.Option<never>, Element>,
  settingsContainer: Z.Effect<never, O.Option<never>, Element>,
  offlineSlate : Z.Effect<never, O.Option<never>, Element>,
}
