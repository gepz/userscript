import * as IO from 'fp-ts/IO';
import * as IOO from 'fp-ts/IOOption';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
  flow,
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
  mainLog: Logger,
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
    (checkBannedWords(data, getConfig, mainLog) ? () => {
      // eslint-disable-next-line no-param-reassign
      chat.style.display = 'none';
    }
      : pipe(
        [
          pipe(
            undefined,
            O.fromPredicate(getConfig.createChats),
            O.filter(() => data.chatType === 'normal'),
            IOO.fromOption,
            IOO.chainIOK(() => addFlowChat(
              getData,
              flowChats,
              chatScrn,
              mainState,
            )),
          ),
          pipe(
            data.authorID,
            IOO.fromOption,
            IOO.filter(getConfig.createBanButton),
            IOO.chainIOK((x) => addBanButton(chat, x, getConfig, setConfig)),
            IO.map(() => O.of(undefined)),
            IOO.filter(getConfig.simplifyChatField),
            IOO.chainIOK(() => setChatFieldSimplifyStyle(chat)),
          ),
        ],
        IO.sequenceArray,
      )
    )();
  }),
  IO.sequenceArray,
);
