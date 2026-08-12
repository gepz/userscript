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
import isAboveVisibleTail from '@/isAboveVisibleTail';
import isDuplicateChat from '@/isDuplicateChat';
import isRepeatedContent from '@/isRepeatedContent';
import parseChat from '@/parseChat';
import recheckChatOnSettle from '@/recheckChatOnSettle';
import rendersNothing from '@/rendersNothing';
import setChatFieldSimplifyStyle from '@/setChatFieldSimplifyStyle';

export default (
  chatScrn: HTMLElement,
  mainState: MainState,
) => (records: MutationRecord[]): Z.Effect<unknown> => pipe(
  Z.succeed(records),
  Z.map(A.flatMap((e) => Array.from(e.addedNodes))),
  // nodeType, not instanceof (cross-realm chat nodes — docs/decisions.md).
  // Non-element nodes (text, comments) have no .children, so they must be
  // dropped before the children check.
  Z.map(A.filter((x): x is HTMLElement => x.nodeType === Node.ELEMENT_NODE
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    && (x as HTMLElement).children.length > 0)),
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
      const backfill = isAboveVisibleTail(chat);

      yield * Z.all([
        pipe(
          addFlowChat(data, chatScrn, mainState),
          Z.when(pipe(
            yield * mainState.flowChats,
            // Redemptions are the per-recipient echo of one gift purchase
            // (identical text, up to one per gifted membership), so only
            // the purchase announcement flows. Backfill — re-inserted more
            // than a screenful above the list's end (see
            // isAboveVisibleTail) — is not live chatter and never flows.
            (flowChats) => () => !backfill
              && mainState.config.value.createChats
              && (data.chatType === 'normal'
                || data.chatType === 'giftPurchase')
              && !rendersNothing(data, mainState.config.value)
              && !A.some(
                flowChats,
                (x) => E.isRight(x.animationState)
                  && (isDuplicateChat(data, x.data)
                    || (mainState.config.value.noRepeatedContent
                      && isRepeatedContent(data, x.data))),
              ),
          )),
        ),
        banEntryFor(data).pipe(
          O.filter(() => mainState.config.value.createBanButton),
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

      // Some renderers insert as pre-hydration skeletons and stamp their
      // content in afterwards (see src/parseChat/fixtures/README.md), so
      // every visible chat gets one settled-state recheck that re-makes
      // the decisions above when a re-parse disagrees. Daemon: outlives
      // this batch's fiber, bounded by the recheck's own deadline.
      yield * Z.forkDaemon(
        recheckChatOnSettle(chat, data, backfill, chatScrn, mainState),
      );
    }
  }))),
);
