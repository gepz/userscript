import * as Z from 'effect/Effect';
import {
  strict,
} from 'effect/Equivalence';
import {
  pipe,
  identity,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';

import MainState from '@/MainState';
import addFlowChat from '@/addFlowChat';
import appendChatMessage from '@/appendChatMessage';
import banButton from '@/banButton';
import checkBannedWords from '@/checkBannedWords';
import parseChat from '@/parseChat';
import setChatFieldSimplifyStyle from '@/setChatFieldSimplifyStyle';

export default (
  chatScrn: HTMLElement,
  mainState: MainState,
) => (records: MutationRecord[]): Z.Effect<unknown> => pipe(
  records,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  RA.flatMap((e) => (Array.from(e.addedNodes) as HTMLElement[])),
  RA.filter((x) => x.children.length > 0),
  RA.reverse,
  RA.map((chat) => pipe(
    Z.succeed({
      data: parseChat(chat),
      config: mainState.config,
      eq: O.getEquivalence(strict()),
    }),
    Z.zipLeft(Z.logDebug('Chat detected')),
    Z.bind('banned', (x) => checkBannedWords(x.data, x.config.value)),
    Z.flatMap((ctx) => (ctx.banned ? Z.sync(() => {
      // eslint-disable-next-line no-param-reassign
      chat.style.display = 'none';
    }) : Z.all([
      pipe(
        ctx.config.value.createChats && ctx.data.chatType === 'normal' && !pipe(
          mainState.flowChats.value,
          RA.filter(((x) => !x.animationEnded)),
          RA.some((x) => ctx.eq(x.data.authorID, ctx.data.authorID)
          && ctx.eq(x.data.messageText, ctx.data.messageText)
          && ctx.eq(x.data.timestamp, ctx.data.timestamp)),
        ),
        O.liftPredicate(identity<boolean>),
        Z.flatMap(() => addFlowChat(
          ctx.data,
          chatScrn,
          mainState,
        )),
        Z.ignore,
      ),
      ctx.data.authorID.pipe(
        O.filter(() => ctx.config.value.createBanButton),
        O.filter(() => !chat.children.namedItem('card')),
        Z.flatMap((x: string) => appendChatMessage(
          banButton(x)(ctx.config.getConfig)(ctx.config.setConfig)(chat),
        )(chat)),
        Z.zipLeft(Z.logDebug('Ban button added')),
        Z.ignore,
      ),
      pipe(
        ctx.config.value.simplifyChatField,
        O.liftPredicate(identity<boolean>),
        Z.flatMap(() => setChatFieldSimplifyStyle(chat)),
        Z.zipLeft(Z.logDebug('Chat simplified')),
        Z.ignore,
      ),
    ]))),
  )),
  Z.all,
);
