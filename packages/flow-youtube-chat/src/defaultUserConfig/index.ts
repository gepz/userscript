import {
  generate,
} from 'astring';
import * as expEval from 'expression-eval';
import * as P from 'fp-ts/Predicate';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import {
  flow,
  pipe,
} from 'fp-ts/function';
import * as S from 'fp-ts/string';

import UserConfig from '@/UserConfig';
import fycKey from '@/fycKey';
import indirectConfig from '@/indirectConfig';
import languages from '@/languages';
import simpleConfig from '@/simpleConfig';

const stringsArgs: [
  [],
  (x: string) => readonly string[],
  (x: readonly string[]) => string,
] = [
  [],
  flow(
    S.split(/\r\n|\n/),
    RA.filter(P.not(S.isEmpty)),
  ),
  (x) => x.join('\n'),
];

const sc = <T extends GM.Value>(
  k: string,
  d: T,
) => simpleConfig(fycKey(k), d);

const ic = <T1 extends GM.Value, T2>(
  k: string,
  d: T2,
  i: (x: T1) => T2,
  g: (x: T2) => GM.Value,
) => indirectConfig(fycKey(k), d, i, g);

export default (): Promise<UserConfig> => pipe(
  async () => ({
    lang: await ic<string, typeof languages[number]>(
      'LANG',
      'FYC_EN',
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      (x) => (languages.includes(x as typeof languages[number])
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        ? (x as typeof languages[number])
        : 'FYC_EN'),
      (x) => x,
    ),
    font: await sc<string>('FONT', 'MS PGothic'),
    chatOpacity: await sc<number>('OPACITY', 0.8),
    color: await sc<string>('COLOR', '#ffffff'),
    ownerColor: await sc<string>('COLOR_OWNER', '#ffd600'),
    moderatorColor: await sc<string>('COLOR_MODERATOR', '#c564ff'),
    memberColor: await sc<string>('COLOR_MEMBER', '#9fffff'),
    fontSize: await sc<number>('SIZE', 1),
    fontWeight: await sc<number>('WEIGHT', 730),
    shadowFontWeight: await sc<number>('WEIGHT_SHADOW', 1),
    maxChatCount: await sc<number>('LIMIT', 40),
    flowSpeed: await sc<number>('SPEED', 18),
    maxChatLength: await sc<number>('MAX', 100),
    laneCount: await sc<number>('LANE_DIV', 12),
    bannedWords: await ic('NG_WORDS', ...stringsArgs),
    bannedWordRegexs: await ic('NG_REG_WORDS', ...stringsArgs),
    bannedUsers: await ic('NG_USERS', ...stringsArgs),
    createChats: await sc<boolean>('TOGGLE_CREATE_COMMENTS', true),
    noOverlap: await sc<boolean>('NO_OVERLAP', true),
    createBanButton: await sc<boolean>('NG_BUTTON', true),
    simplifyChatField: await sc<boolean>('SIMPLE_CHAT_FIELD', false),
    displayModName: await sc<boolean>('DISPLAY_MODERATOR_NAME', true),
    displaySuperChatAuthor: await sc<boolean>(
      'DISPLAY_SUPER_CHAT_AUTHOR',
      true,
    ),
    textOnly: await sc<boolean>('TEXT_ONLY', false),
    timingFunction: await sc<string>('TIMING_FUNCTION', 'linear'),
    displayChats: await sc<boolean>('DISPLAY_COMMENTS', true),
    minSpacing: await sc<number>('MIN_SPACING', 0.5),
    fieldScale: await sc<number>('FIELD_SCALE', 1.0),
    flowY1: await sc<number>('flowY1', 0.0),
    flowY2: await sc<number>('flowY2', 1.0),
    flowX1: await sc<number>('flowX1', 0.0),
    flowX2: await sc<number>('flowX2', 1.0),
    shadowColor: await sc<string>('shadowColor', '#000000'),
  }),
  //   T.bind(
  //     'filterExp',
  //     (x) => () => ic<string, expEval.parse.Expression>(
  //       'filterExp',
  //       expEval.parse(`,
  // or([
  // RA.some(
  //   flip(flow([matchedByText, RA.some]))(${
  //   JSON.stringify(x.bannedWordRegexs.val)
  // })
  // )(RA.compact([
  //   messageText,
  //   paymentInfo
  // ])),
  // RA.some(
  //   flip(flow([inText, RA.some]))(${JSON.stringify(x.bannedWords.val)})
  // )(RA.compact([
  //   messageText,
  //   paymentInfo
  // ])),
  // O.exists(
  //   flip(flow([eqText, RA.some]))(${JSON.stringify(x.bannedUsers.val)})
  // )(authorID)
  // ])
  //       `),
  //       expEval.parse,
  //       generate,
  //     ),
  //   ),

  // displayMatrix: await ic(
  //   'displayMatrix',
  //   [
  //     [true, true, true],
  //     [false, true],
  //     [false, true],
  //     [false, true],
  //   ],
  //   flow(
  //     S.split(','),
  //     RA.map(flow(
  //       S.split(''),
  //       RA.map((x) => x === '1'),
  //     )),
  //   ),
  //   flow(
  //     RA.map((x) => x.join()),
  //     (x) => x.join(','),
  //   ),
  // ),
)();
