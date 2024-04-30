import {
  Effect as Z,
  Option as O,
} from 'effect';
import {
  pipe,
} from 'effect/Function';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';

export default (
  chat: FlowChat,
) => (mainState: MainState): Z.Effect<void> => pipe(
  chat,
  O.liftPredicate((x) => !x.animationEnded),
  Z.flatMap((x: FlowChat) => x.animation),
  Z.tap((x) => Z.sync(mainState.chatPlaying.value ? () => x.play()
  : () => x.pause())),
  Z.flatMap((x) => Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    x.playbackRate = mainState.config.value.flowSpeed / 15;
  })),
  Z.ignore,
);
