import {
  pipe,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';

import ChatData from '@/ChatData';
import FlowChat from '@/FlowChat';
import MainState from '@/MainState';
import UserConfig from '@/UserConfig';
import getChatFontSize from '@/getChatFontSize';
import getChatLane from '@/getChatLane';
import intervalTooSmall from '@/intervalTooSmall';
import renderChat from '@/renderChat';
import setChatAnimation from '@/setChatAnimation';

const emptyElement = document.createElement('span');

export default (
  getData: (config: UserConfig) => ChatData,
  chatScrn: HTMLElement,
  mainState: MainState,
): Z.Effect<never, never, void> => (pipe(
  {
    getData,
    element: emptyElement,
    lane: -1,
    animation: O.none(),
    animationDuration: 0,
    animationEnded: false,
    width: 2,
    height: getChatFontSize(mainState),
    y: 0,
  } satisfies FlowChat,
  (x: FlowChat) => getChatLane(
    x,
    0,
  )(mainState).interval,
  intervalTooSmall,
  (x) => x(mainState.config),
) ? Z.unit
: pipe(
  mainState.flowChats.value,
  RA.findFirstIndex((chat) => chat.animationEnded
     || mainState.flowChats.value.length >= mainState.config.maxChatCount),
  (offScreenIndex) => pipe(
    offScreenIndex,
    O.map((index) => pipe(
      mainState.flowChats.value,
      RA.unsafeGet(index),
      (x) => x.element,
    )),
    O.getOrElse(() => document.createElement('span')),
    Z.succeed,
    Z.tap((element) => pipe(
      offScreenIndex,
      O.match({
        onNone: () => pipe(
          Z.sync(() => chatScrn.append(element)),
          Z.zipLeft(Z.log({
            level: 'Debug',
          })('Flow chat added')),
        ),
        onSome: (index) => pipe(
          mainState.flowChats.value,
          RA.unsafeGet(index),
          (x) => x.animation,
          Z.flatMap((oldAnimation) => Z.sync(() => oldAnimation.cancel())),
          Z.zipRight(Z.sync(() => mainState.flowChats.next(pipe(
            mainState.flowChats.value,
            RA.remove(index),
          )))),
          Z.ignore,
        ),
      }),
    )),
  ),
  Z.flatMap((element) => pipe(
    {
      getData,
      element,
      lane: -1,
      animation: O.none(),
      animationDuration: 0,
      animationEnded: false,
      width: 2,
      height: getChatFontSize(mainState),
      y: 0,
    },
    Z.succeed<FlowChat>,
    Z.zipLeft(Z.sync(() => element.classList.add('fyc_chat'))),
  )),
  Z.flatMap((flowChat) => pipe(
    mainState,
    Z.succeed,
    Z.tap(renderChat(flowChat)),
    Z.flatMap(setChatAnimation(flowChat)),
    Z.flatMap((x) => (x ? Z.sync(() => mainState.flowChats.next(pipe(
      mainState.flowChats.value,
      RA.append(flowChat),
    )))
    : pipe(
      Z.sync(() => flowChat.element.remove()),
      Z.zipLeft(Z.log({
        level: 'Debug',
      })('Flow chat removed')),
    ))),
  )),
));
