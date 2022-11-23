import * as IO from 'fp-ts/IO';
import * as IOO from 'fp-ts/IOOption';
import * as I from 'fp-ts/Identity';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import * as S from 'fp-ts/State';
import {
  pipe,
  flow,
  identity,
} from 'fp-ts/function';

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
): R.Reader<MutationRecord[], S.State<unknown[], IO.IO<unknown>>> => flow(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  RA.chain((e) => (Array.from(e.addedNodes) as HTMLElement[])),
  RA.filter((x) => x.children.length > 0),
  RA.reverse,
  RA.map((chat) => pipe(
    {
      getData: parseChat(chat),
      config: mainState.config,
    },
    I.let('data', (x) => x.getData(x.config)),
    S.of,
    S.bind('banned', (x) => pipe(
      checkBannedWords(x.data, x.config),
    )),
    S.map((ctx) => (ctx.banned ? () => {
      // eslint-disable-next-line no-param-reassign
      chat.style.display = 'none';
    } : IO.sequenceArray([
      pipe(
        ctx.config.createChats && ctx.data.chatType === 'normal',
        IOO.fromPredicate(identity),
        IOO.chainIOK(() => addFlowChat(
          ctx.getData,
          flowChats,
          chatScrn,
          mainState,
        )),
      ),
      pipe(
        ctx.data.authorID,
        O.filter(() => ctx.config.createBanButton),
        IOO.fromOption,
        IOO.filter(() => !chat.children.namedItem('card')),
        IOO.chainIOK((x) => R.chain(appendChatMessage)(
          banButton(x)(getConfig)(setConfig),
        )(chat)),
      ),
      pipe(
        ctx.config.simplifyChatField,
        IOO.fromPredicate(identity),
        IOO.chainIOK(() => setChatFieldSimplifyStyle(chat)),
      ),
    ]))),
  )),
  S.sequenceArray,
  S.map(IO.sequenceArray),
);
