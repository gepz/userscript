import {
  Effect as Z,
  Either as E,
  Option as O,
  Array as A,
  pipe,
} from 'effect';

import MainState from '@/MainState';
import addFlowChat from '@/addFlowChat';
import appendChatMessage from '@/appendChatMessage';
import banButton from '@/banButton';
import checkBannedWords from '@/checkBannedWords';
import parseChat from '@/parseChat';
import setChatFieldSimplifyStyle from '@/setChatFieldSimplifyStyle';
import strictOptionEquivalence from '@/strictOptionEquivalence';

export default (
  chatScrn: HTMLElement,
  mainState: MainState,
) => (records: MutationRecord[]): Z.Effect<unknown> => pipe(
  Z.succeed(records),
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  Z.map(A.flatMap((e) => (Array.from(e.addedNodes) as HTMLElement[]))),
  Z.map(A.filter((x) => x.children.length > 0)),
  Z.map(A.reverse),
  // eslint-disable-next-line func-names
  Z.flatMap(Z.forEach((chat) => Z.gen(function* () {
    yield* Z.logDebug('Chat detected');
    const data = parseChat(chat);
    if (yield* checkBannedWords(data, mainState.config.value)) {
      // eslint-disable-next-line no-param-reassign
      chat.style.display = 'none';
    } else {
      yield* Z.all([
        pipe(
          addFlowChat(data, chatScrn, mainState),
          Z.when(() => mainState.config.value.createChats
            && data.chatType === 'normal' && !pipe(
            mainState.flowChats.value,
            A.some((x) => E.isRight(x.animationState)
            && strictOptionEquivalence(x.data.authorID, data.authorID)
            && strictOptionEquivalence(x.data.messageText, data.messageText)
            && strictOptionEquivalence(x.data.timestamp, data.timestamp)),
          )),
        ),
        data.authorID.pipe(
          O.filter(() => mainState.config.value.createBanButton
             && !chat.children.namedItem('card')),
          Z.flatMap((x: string) => appendChatMessage(
            banButton(x)(mainState.config.getConfig)(
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
