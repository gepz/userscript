import {
  pipe,
  identity,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';

import MainState from '@/MainState';
import UserConfigGetter from '@/UserConfigGetter';
import UserConfigSetter from '@/UserConfigSetter';
import addFlowChat from '@/addFlowChat';
import appendChatMessage from '@/appendChatMessage';
import banButton from '@/banButton';
import checkBannedWords from '@/checkBannedWords';
import parseChat from '@/parseChat';
import setChatFieldSimplifyStyle from '@/setChatFieldSimplifyStyle';

export default (
  chatScrn: HTMLElement,
  mainState: MainState,
  getConfig: UserConfigGetter,
  setConfig: UserConfigSetter,
) => (records: MutationRecord[]): Z.Effect<never, never, unknown> => pipe(
  records,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  RA.flatMap((e) => (Array.from(e.addedNodes) as HTMLElement[])),
  RA.filter((x) => x.children.length > 0),
  RA.reverse,
  RA.map((chat) => pipe(
    {
      getData: parseChat(chat),
      config: mainState.config,
    },
    Z.succeed,
    Z.let('data', (x) => x.getData(x.config)),
    Z.zipLeft(Z.logDebug('Chat detected')),
    Z.bind('banned', (x) => checkBannedWords(x.data, x.config)),
    Z.flatMap((ctx) => (ctx.banned ? Z.sync(() => {
      // eslint-disable-next-line no-param-reassign
      chat.style.display = 'none';
    }) : Z.all([
      pipe(
        ctx.config.createChats && ctx.data.chatType === 'normal',
        O.liftPredicate(identity<boolean>),
        Z.flatMap<boolean, never, never, void>(() => addFlowChat(
          ctx.getData,
          chatScrn,
          mainState,
        )),
        Z.ignore,
      ),
      ctx.data.authorID.pipe(
        O.filter(() => ctx.config.createBanButton),
        O.filter(() => !chat.children.namedItem('card')),
        Z.flatMap((x: string) => appendChatMessage(
          banButton(x)(getConfig)(setConfig)(chat),
        )(chat)),
        Z.zipLeft(Z.logDebug('Ban button added')),
        Z.ignore,
      ),
      pipe(
        ctx.config.simplifyChatField,
        O.liftPredicate(identity<boolean>),
        Z.flatMap(() => setChatFieldSimplifyStyle(chat)),
        Z.zipLeft(Z.logDebug('Chat simplified')),
        Z.ignore,
      ),
    ]))),
  )),
  Z.all,
);
