import * as IO from 'fp-ts/IO';
import * as O from 'fp-ts/Option';

export default interface LivePage {
  chatField: IO.IO<O.Option<HTMLElement>>,
  chatTicker: IO.IO<O.Option<HTMLElement>>,
  chatScroller: IO.IO<O.Option<HTMLElement>>,
  video: IO.IO<O.Option<HTMLVideoElement>>,
  player: IO.IO<O.Option<Element>>,
  toggleChatBtnParent: IO.IO<O.Option<Element>>,
  settingNextElement: IO.IO<O.Option<Element>>,
  offlineSlate : IO.IO<O.Option<Element>>,
}
