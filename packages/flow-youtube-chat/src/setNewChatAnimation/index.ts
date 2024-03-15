import * as Z from 'effect/Effect';
import {
  pipe,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';
import * as tuple from 'effect/Tuple';

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
      onNone: () => Z.unit,
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
      (x) => RA.map(tuple.mapBoth({
        onFirst: x,
        onSecond: x,
      })),
    )),
    Z.map(RA.map(([x, y]) => ({
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
