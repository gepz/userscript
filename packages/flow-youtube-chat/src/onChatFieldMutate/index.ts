import {
  Effect as Z,
  Either as E,
  Option as O,
  Array as A,
  SynchronizedRef,
  pipe,
} from 'effect';

import {
  isBannedByName,
  recordAuthor,
} from '@/AuthorNameIndex';
import {
  banEntryFor,
  isBannedAuthor,
} from '@/BanEntry';
import MainState from '@/MainState';
import addFlowChat from '@/addFlowChat';
import appendChatMessage from '@/appendChatMessage';
import banButton from '@/banButton';
import checkBannedWords from '@/checkBannedWords';
import isDuplicateChat from '@/isDuplicateChat';
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
  Z.flatMap(Z.forEach(Z.fnUntraced(function* (chat: HTMLElement) {
    yield * Z.logDebug('Chat detected');
    const data = parseChat(chat);
    // Every chat feeds the index — a banned author's own messages are what
    // associate their id with their display name.
    const authorNames = yield * SynchronizedRef.updateAndGet(
      mainState.authorNames,
      recordAuthor(data),
    );

    if ((yield * checkBannedWords(data, mainState.config.value))
      || isBannedAuthor(mainState.config.value.bannedUsers)(data)
      || isBannedByName(mainState.config.value.bannedUsers)(authorNames)(
        data,
      )) {
      chat.style.display = 'none';
    } else {
      yield * Z.all([
        pipe(
          addFlowChat(data, chatScrn, mainState),
          Z.when(pipe(
            yield * mainState.flowChats,
            // Redemptions are the per-recipient echo of one gift purchase
            // (identical text, up to one per gifted membership), so only
            // the purchase announcement flows.
            (flowChats) => () => mainState.config.value.createChats
              && (data.chatType === 'normal'
                || data.chatType === 'giftPurchase') && !A.some(
              flowChats,
              (x) => E.isRight(x.animationState)
                && isDuplicateChat(data, x.data),
            ),
          )),
        ),
        banEntryFor(data).pipe(
          O.filter(() => mainState.config.value.createBanButton
            && !chat.children.namedItem('card')),
          Z.flatMap((entry: string) => appendChatMessage(
            banButton(entry)(mainState.config.getConfig)(
              mainState.config.setConfig,
            )(chat),
          )(chat)),
          Z.zipLeft(Z.logDebug('Ban button added')),
        ),
        pipe(
          setChatFieldSimplifyStyle(chat),
          Z.when(() => mainState.config.value.simplifyChatField),
          Z.zipLeft(Z.logDebug('Chat simplified')),
        ),
      ], {
        mode: 'either',
      });
    }
  }))),
);
