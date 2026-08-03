import {
  Effect as Z,
  Record as R,
} from 'effect';
import type jsep from 'jsep';

import type GMConfig from '@/GMConfig';
import languages from '@/languages';

// The hand-written root map. Per-key structures (GMConfig, setters,
// dispatch tables) derive forward from this type so that generic-key
// indexing stays correlated — see docs/correlated-unions.md.
// Deliberately a type alias, not an interface: aliases get the implicit
// index signature that Record-constrained generics (stream/makeRefs) need.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type UserConfig = {
  lang: typeof languages[number]
  font: string
  color: string
  ownerColor: string
  moderatorColor: string
  memberColor: string
  chatOpacity: number
  fontSize: number
  fontWeight: number
  shadowFontWeight: number
  maxChatCount: number
  flowSpeed: number
  maxChatLength: number
  laneCount: number
  excludedLanes: readonly number[]
  bannedWords: readonly string[]
  bannedWordRegexes: readonly string[]
  bannedUsers: readonly string[]
  createChats: boolean
  displayChats: boolean
  createBanButton: boolean
  simplifyChatField: boolean
  displayModName: boolean
  displaySuperChatAuthor: boolean
  textOnly: boolean
  timingFunction: string
  noOverlap: boolean
  noRepeatedContent: boolean
  minSpacing: number
  fieldScale: number
  flowY1: number
  flowY2: number
  flowX1: number
  flowX2: number
  shadowColor: string
  logEvents: boolean
  filterExp: jsep.Expression
  // displayMatrix: readonly (readonly boolean[])[],
};

export default UserConfig;

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const makeConfig = (config: GMConfig): Z.Effect<UserConfig> => Z.all(
  R.map(config, (c) => c.getValue),
) as Z.Effect<UserConfig>;
