import * as IO from 'fp-ts/IO';
import * as IOO from 'fp-ts/IOOption';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import {
  pipe,
} from 'fp-ts/function';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';

export default (
  chat: FlowChat,
): R.Reader<MainState, IO.IO<void>> => (mainState) => pipe(
  chat,
  O.fromPredicate((x) => !x.animationEnded),
  IOO.fromOption,
  IOO.chainOptionK((x) => x.animation),
  IOO.chainFirst((x) => IOO.fromIO(
    mainState.chatPlaying ? () => x.play()
    : () => x.pause(),
  )),
  IOO.chain((x) => IOO.fromIO(() => {
    // eslint-disable-next-line no-param-reassign
    x.playbackRate = mainState.getConfig.flowSpeed() / 15;
  })),
);
