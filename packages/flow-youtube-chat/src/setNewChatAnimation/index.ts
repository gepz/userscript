import {
  Array as A,
  Effect as Z,
  Either as E,
  Tuple as tuple,
  pipe,
  SynchronizedRef,
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
  getLaneY(lane, mainState),
  Z.map((y): FlowChat => ({
    ...chat,
    lane,
    y,
  })),
  Z.tap((newChat) => pipe(
    newChat.animationState,
    E.match(({
      onLeft: () => Z.void,
      onRight: (x) => Z.sync(() => x.cancel()),
    })),
  )),
  Z.flatMap((newChat) => SynchronizedRef.get(mainState.playerRect).pipe(
    Z.map((rect) => [
      [
        rect.width
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
        animationState: E.right(animation),
      } satisfies Partial<FlowChat>;

      Object.assign(animation, {
        onfinish: () => Object.assign(newNewChat, {
          animationState: E.left('Ended'),
        } satisfies Partial<FlowChat>),
        currentTime: progress * flowDuration,
      } satisfies Partial<Animation>);

      return newNewChat;
    })),
  )),
);
