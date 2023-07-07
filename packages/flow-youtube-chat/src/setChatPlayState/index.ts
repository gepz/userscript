import {
  pipe,
  identity,
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
  Z.map((x: FlowChat) => x.animation),
  Z.flatMap(identity),
  Z.tap((x) => Z.sync(mainState.chatPlaying.value ? () => x.play()
  : () => x.pause())),
  Z.flatMap((x) => Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    x.playbackRate = mainState.config.flowSpeed / 15;
  })),
  Z.ignore,
);
