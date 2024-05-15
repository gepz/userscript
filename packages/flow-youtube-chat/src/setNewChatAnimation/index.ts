import {
  Array as A,
  Effect as Z,
  Option as O,
  Tuple as tuple,
  pipe,
} from 'effect';

import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import flowDuration from '@/flowDuration';
import getLaneY from '@/getLaneY';

export default (
  chat: FlowChat,
) => (
  lane: number,
) => (
  progress: number,
) => (
  mainState: MainState,
): Z.Effect<FlowChat> => pipe(
  Z.sync((): FlowChat => ({
    ...chat,
    lane,
    y: getLaneY(lane, mainState),
  })),
  Z.tap((newChat) => pipe(
    newChat.animation,
    O.match(({
      onNone: () => Z.void,
      onSome: (x) => Z.sync(() => x.cancel()),
    })),
  )),
  Z.flatMap((newChat) => pipe(
    Z.succeed([
      [
        mainState.playerRect.value.width
          * (mainState.config.value.flowX2 - mainState.config.value.flowX1),
        newChat.y,
      ],
      [
        -newChat.width,
        newChat.y,
      ],
    ] as const),
    Z.map(pipe(
      (x: number) => `${x}px`,
      (x) => A.map(tuple.mapBoth({
        onFirst: x,
        onSecond: x,
      })),
    )),
    Z.map(A.map(([x, y]) => ({
      transform: `translate(${x}, ${y})`,
    }))),
    Z.flatMap((x) => Z.sync(() => newChat.element.animate(x, {
      duration: flowDuration,
      easing: mainState.config.value.timingFunction,
    }))),
    Z.flatMap((animation) => Z.sync((): FlowChat => {
      const newNewChat = {
        ...newChat,
        animation: O.some(animation),
      };

      Object.assign(animation, {
        onfinish: () => Object.assign(newNewChat, {
          animationEnded: true,
        } satisfies Partial<FlowChat>),
        currentTime: progress * flowDuration,
      } satisfies Partial<Animation>);

      return newNewChat;
    })),
  )),
);
