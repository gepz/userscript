import {
  pipe,
  flow,
  identity,
} from '@effect/data/Function';
import * as I from '@effect/data/Identity';
import * as O from '@effect/data/Option';
import * as RA from '@effect/data/ReadonlyArray';
import * as Z from '@effect/io/Effect';

import FlowChat from '@/FlowChat';
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
  flowChats: FlowChat[],
  mainState: MainState,
  getConfig: UserConfigGetter,
  setConfig: UserConfigSetter,
): (r: MutationRecord[]) => Z.Effect<never, never, unknown> => flow(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  RA.flatMap((e) => (Array.from(e.addedNodes) as HTMLElement[])),
  RA.filter((x) => x.children.length > 0),
  RA.reverse,
  RA.map((chat) => pipe(
    {
      getData: parseChat(chat),
      config: mainState.config,
    },
    I.let('data', (x) => x.getData(x.config)),
    Z.succeed,
    Z.bind('banned', (x) => pipe(
      checkBannedWords(x.data, x.config),
    )),
    Z.flatMap((ctx) => (ctx.banned ? Z.sync(() => {
      // eslint-disable-next-line no-param-reassign
      chat.style.display = 'none';
    }) : Z.all([
      pipe(
        ctx.config.createChats && ctx.data.chatType === 'normal',
        O.liftPredicate(identity<boolean>),
        Z.fromOption,
        Z.flatMap(() => addFlowChat(
          ctx.getData,
          flowChats,
          chatScrn,
          mainState,
        )),
      ),
      pipe(
        ctx.data.authorID,
        O.filter(() => ctx.config.createBanButton),
        O.filter(() => !chat.children.namedItem('card')),
        Z.fromOption,
        Z.flatMap((x) => appendChatMessage(
          banButton(x)(getConfig)(setConfig)(chat),
        )(chat)),
      ),
      pipe(
        ctx.config.simplifyChatField,
        O.liftPredicate(identity<boolean>),
        Z.fromOption,
        Z.flatMap(() => setChatFieldSimplifyStyle(chat)),
      ),
    ]))),
    Z.ignore,
  )),
  (x) => Z.all(x),
);
