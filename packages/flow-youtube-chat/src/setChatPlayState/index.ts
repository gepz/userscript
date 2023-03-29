import {
  pipe,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as Z from '@effect/io/Effect';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';

export default (
  chat: FlowChat,
) => (mainState: MainState): Z.Effect<never, never, void> => pipe(
  chat,
  O.liftPredicate((x) => !x.animationEnded),
  Z.fromOption,
  Z.map((x) => x.animation),
  Z.flatMap(Z.fromOption),
  Z.tap((x) => Z.sync(mainState.chatPlaying ? () => x.play()
  : () => x.pause())),
  Z.flatMap((x) => Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    x.playbackRate = mainState.config.flowSpeed / 15;
  })),
  Z.ignore,
);
