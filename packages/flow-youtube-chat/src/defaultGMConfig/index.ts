import {
  generate,
} from 'astring';
import {
  pipe,
} from 'effect/Function';
import * as P from 'effect/Predicate';
import * as RA from 'effect/ReadonlyArray';
import * as Str from 'effect/String';
import * as expEval from 'expression-eval';

import GMConfig from '@/GMConfig';
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
  (x) => pipe(
    Str.split(x, /\r\n|\n/),
    RA.filter(P.not(Str.isEmpty)),
  ),
  RA.join('\n'),
];

const sc = <T extends GM.Value>(
  k: string,
  d: T,
) => simpleConfig(fycKey(k), d);

const ic = <T1 extends GM.Value, T2>(
  k: string,
  d: T2,
  c: (x: T1) => T2,
  g: (x: T2) => GM.Value,
) => indirectConfig(fycKey(k), d, c, g);

const defaultGMConfig: GMConfig = pipe(
  {
    lang: ic<string, typeof languages[number]>(
      'LANG',
      'FYC_EN',
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      (x) => (languages.includes(x as typeof languages[number])
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        ? (x as typeof languages[number])
        : 'FYC_EN'),
      (x) => x,
    ),
    font: sc<string>('FONT', 'MS PGothic'),
    chatOpacity: sc<number>('OPACITY', 0.8),
    color: sc<string>('COLOR', '#ffffff'),
    ownerColor: sc<string>('COLOR_OWNER', '#ffd600'),
    moderatorColor: sc<string>('COLOR_MODERATOR', '#c564ff'),
    memberColor: sc<string>('COLOR_MEMBER', '#9fffff'),
    fontSize: sc<number>('SIZE', 1),
    fontWeight: sc<number>('WEIGHT', 730),
    shadowFontWeight: sc<number>('WEIGHT_SHADOW', 1),
    maxChatCount: sc<number>('LIMIT', 40),
    flowSpeed: sc<number>('SPEED', 18),
    maxChatLength: sc<number>('MAX', 100),
    laneCount: sc<number>('LANE_DIV', 12),
    bannedWords: ic('NG_WORDS', ...stringsArgs),
    bannedWordRegexes: ic('NG_REG_WORDS', ...stringsArgs),
    bannedUsers: ic('NG_USERS', ...stringsArgs),
    createChats: sc<boolean>('TOGGLE_CREATE_COMMENTS', true),
    noOverlap: sc<boolean>('NO_OVERLAP', true),
    createBanButton: sc<boolean>('NG_BUTTON', true),
    simplifyChatField: sc<boolean>('SIMPLE_CHAT_FIELD', false),
    displayModName: sc<boolean>('DISPLAY_MODERATOR_NAME', true),
    displaySuperChatAuthor: sc<boolean>('DISPLAY_SUPER_CHAT_AUTHOR', true),
    textOnly: sc<boolean>('TEXT_ONLY', false),
    timingFunction: sc<string>('TIMING_FUNCTION', 'linear'),
    displayChats: sc<boolean>('DISPLAY_COMMENTS', true),
    minSpacing: sc<number>('MIN_SPACING', 0.5),
    fieldScale: sc<number>('FIELD_SCALE', 1.0),
    flowY1: sc<number>('flowY1', 0.0),
    flowY2: sc<number>('flowY2', 1.0),
    flowX1: sc<number>('flowX1', 0.0),
    flowX2: sc<number>('flowX2', 1.0),
    shadowColor: sc<string>('shadowColor', '#000000'),
    logEvents: sc<boolean>('logEvents', true),
  },
  (x) => ({
    ...x,
    filterExp: ic<string, expEval.parse.Expression>(
      'filterExp',
      expEval.parse(`
  or([
  RA.some(
    flip(flow([inText, RA.some]))(${JSON.stringify(x.bannedWords.defaultValue)})
  )(RA.getSomes([
    messageText,
    paymentInfo
  ])),
  RA.some(
    flip(flow([matchedByText, RA.some]))(${
    JSON.stringify(x.bannedWordRegexes.defaultValue)
    })
  )(RA.getSomes([
    messageText,
    paymentInfo
  ])),
  O.exists(
    flip(flow([eqText, RA.some]))(${JSON.stringify(x.bannedUsers.defaultValue)})
  )(authorID)
  ])
        `),
      expEval.parse,
      generate,
    ),
  }),
);

export default defaultGMConfig;

// displayMatrix: ic(
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
//     RA.map(RA.join('')),
//     RA.join(','),
//   ),
// ),

