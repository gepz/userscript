import {
  Effect as Z,
  pipe,
} from 'effect';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';

export default (
  chat: FlowChat,
) => (mainState: MainState): Z.Effect<void> => pipe(
  chat.animationState,
  Z.tap((x) => Z.sync(mainState.chatPlaying.value ? () => x.play()
  : () => x.pause())),
  Z.flatMap((x) => Z.sync(() => {
    // eslint-disable-next-line no-param-reassign
    x.playbackRate = mainState.config.value.flowSpeed / 15;
  })),
  Z.ignore,
);
