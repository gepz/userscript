import * as IO from 'fp-ts/IO';
import * as IOO from 'fp-ts/IOOption';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
  flow,
  identity,
} from 'fp-ts/function';

import FlowChat from '@/FlowChat';
import Logger from '@/Logger';
import MainState from '@/MainState';
import UserConfigSetter from '@/UserConfigSetter';
import addBanButton from '@/addBanButton';
import addFlowChat from '@/addFlowChat';
import checkBannedWords from '@/checkBannedWords';
import parseChat from '@/parseChat';
import setChatFieldSimplifyStyle from '@/setChatFieldSimplifyStyle';

export default (
  chatScrn: HTMLElement,
  flowChats: FlowChat[],
  mainState: MainState,
  setConfig: UserConfigSetter,
  log: Logger,
): R.Reader<MutationRecord[], IO.IO<unknown>> => flow(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  RA.chain((e) => (Array.from(e.addedNodes) as HTMLElement[])),
  RA.filter((x) => x.children.length > 0),
  RA.reverse,
  RA.map((chat) => () => {
    const getData = parseChat(chat);
    const {
      getConfig,
    } = mainState;

    const data = getData(getConfig);
    (checkBannedWords(data, getConfig, log) ? () => {
      // eslint-disable-next-line no-param-reassign
      chat.style.display = 'none';
    } : IO.sequenceArray([
      pipe(
        getConfig.createChats() && data.chatType === 'normal',
        IOO.fromPredicate(identity),
        IOO.chainIOK(() => addFlowChat(
          getData,
          flowChats,
          chatScrn,
          mainState,
        )),
      ),
      pipe(
        data.authorID,
        O.filter(getConfig.createBanButton),
        IOO.fromOption,
        IOO.chainIOK((x) => addBanButton(chat, x, getConfig, setConfig)),
      ),
      pipe(
        getConfig.simplifyChatField(),
        IOO.fromPredicate(identity),
        IOO.chainIOK(() => setChatFieldSimplifyStyle(chat)),
      ),
    ])
    )();
  }),
  IO.sequenceArray,
);
