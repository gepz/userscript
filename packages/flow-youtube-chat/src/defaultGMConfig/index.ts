import {
  generate,
} from 'astring';
import {
  Array as A,
  Number as N,
  Predicate as P,
  Schema as S,
  String as Str,
  pipe,
} from 'effect';
import {
  identity,
} from 'effect/Function';
import jsep from 'jsep';

import GMConfig from '@/GMConfig';
import defaultFilter from '@/defaultFilter';
import fycKey from '@/fycKey';
import indirectConfig from '@/indirectConfig';
import languages from '@/languages';
import simpleConfig from '@/simpleConfig';

const stringsArgs: [
  [],
  S.Schema<string>,
  (x: string) => readonly string[],
  (x: readonly string[]) => string,
] = [
  [],
  S.String,
  (x) => pipe(
    Str.split(x, /\r\n|\n/),
    A.filter(P.not(Str.isEmpty)),
  ),
  A.join('\n'),
];

const sc = <T extends GM.Value>(
  k: string,
  d: T,
) => simpleConfig(fycKey(k), d);

const ic = <T1 extends GM.Value, T2>(
  k: string,
  d: T2,
  s: S.Schema<T1>,
  c: (x: T1) => T2,
  g: (x: T2) => GM.Value,
) => indirectConfig(fycKey(k), d, s, c, g);

const defaultGMConfig: GMConfig = pipe(
  {
    lang: ic<typeof languages[number], typeof languages[number]>(
      'LANG',
      'FYC_EN',
      S.Literal(...languages),
      identity,
      identity,
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
    // The decoder normalizes to sorted, deduped, non-negative integers;
    // allowedSegments relies on exactly that shape. Lanes at or beyond
    // laneCount are dropped on laneCount shrink (see setState.laneCount),
    // not here, so a stored stray survives only until the next write.
    excludedLanes: ic<string, readonly number[]>(
      'EXCLUDED_LANES',
      [],
      S.String,
      (x) => pipe(
        Str.split(x, ','),
        A.filterMap(N.parse),
        A.filter((n) => Number.isInteger(n) && n >= 0),
        A.sort(N.Order),
        A.dedupeAdjacent,
      ),
      (x) => x.join(','),
    ),
    bannedWords: ic('NG_WORDS', ...stringsArgs),
    bannedWordRegexes: ic('NG_REG_WORDS', ...stringsArgs),
    bannedUsers: ic('NG_USERS', ...stringsArgs),
    createChats: sc<boolean>('TOGGLE_CREATE_COMMENTS', true),
    noOverlap: sc<boolean>('NO_OVERLAP', true),
    noRepeatedContent: sc<boolean>('NO_REPEATED_CONTENT', false),
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
    filterExp: ic<string, jsep.Expression>(
      'filterExp',
      defaultFilter({
        bannedWords: x.bannedWords.defaultValue,
        bannedWordRegexes: x.bannedWordRegexes.defaultValue,
        bannedUsers: x.bannedUsers.defaultValue,
      }),
      S.String,
      jsep,
      generate,
    ),
  }),
);

export default defaultGMConfig;
