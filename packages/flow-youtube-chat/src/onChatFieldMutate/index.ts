import {
  Effect as Z,
  Option as O,
  Array as A,
} from 'effect';
import {
  strict,
} from 'effect/Equivalence';
import {
  pipe,
} from 'effect/Function';

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
  Z.succeed(records),
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  Z.map(A.flatMap((e) => (Array.from(e.addedNodes) as HTMLElement[]))),
  Z.map(A.filter((x) => x.children.length > 0)),
  Z.map(A.reverse),
  Z.flatMap(Z.forEach((chat) => pipe(
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
        Z.sync(() => addFlowChat(ctx.data, chatScrn, mainState)),
        Z.when(() => ctx.config.value.createChats
        && ctx.data.chatType === 'normal' && !pipe(
          mainState.flowChats.value,
          A.some((x) => !x.animationEnded
          && ctx.eq(x.data.authorID, ctx.data.authorID)
          && ctx.eq(x.data.messageText, ctx.data.messageText)
          && ctx.eq(x.data.timestamp, ctx.data.timestamp)),
        )),
        Z.flatMap(Z.flatten),
      ),
      ctx.data.authorID.pipe(
        O.filter(() => ctx.config.value.createBanButton
         && !chat.children.namedItem('card')),
        Z.flatMap((x: string) => appendChatMessage(
          banButton(x)(ctx.config.getConfig)(ctx.config.setConfig)(chat),
        )(chat)),
        Z.zipLeft(Z.logDebug('Ban button added')),
      ),
      pipe(
        Z.sync(() => setChatFieldSimplifyStyle(chat)),
        Z.when(() => ctx.config.value.simplifyChatField),
        Z.flatMap(Z.flatten),
        Z.zipLeft(Z.logDebug('Chat simplified')),
      ),
    ], {
      mode: 'either',
    }))),
  ))),
);
