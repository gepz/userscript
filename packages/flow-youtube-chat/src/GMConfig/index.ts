import * as expEval from 'expression-eval';

import GMConfigItem from '@/GMConfigItem';
import languages from '@/languages';

export default interface GMConfig {
  lang: GMConfigItem<typeof languages[number]>,
  font: GMConfigItem<string>,
  color: GMConfigItem<string>,
  ownerColor: GMConfigItem<string>,
  moderatorColor: GMConfigItem<string>,
  memberColor: GMConfigItem<string>,
  chatOpacity: GMConfigItem<number>,
  fontSize: GMConfigItem<number>,
  fontWeight: GMConfigItem<number>,
  shadowFontWeight: GMConfigItem<number>,
  maxChatCount: GMConfigItem<number>,
  flowSpeed: GMConfigItem<number>,
  maxChatLength: GMConfigItem<number>,
  laneCount: GMConfigItem<number>,
  bannedWords: GMConfigItem<readonly string[]>,
  bannedWordRegexes: GMConfigItem<readonly string[]>,
  bannedUsers: GMConfigItem<readonly string[]>,
  createChats: GMConfigItem<boolean>,
  displayChats: GMConfigItem<boolean>,
  createBanButton: GMConfigItem<boolean>,
  simplifyChatField: GMConfigItem<boolean>,
  displayModName: GMConfigItem<boolean>,
  displaySuperChatAuthor: GMConfigItem<boolean>,
  textOnly: GMConfigItem<boolean>,
  timingFunction: GMConfigItem<string>,
  noOverlap: GMConfigItem<boolean>,
  minSpacing: GMConfigItem<number>,
  fieldScale: GMConfigItem<number>,
  flowY1: GMConfigItem<number>,
  flowY2: GMConfigItem<number>,
  flowX1: GMConfigItem<number>,
  flowX2: GMConfigItem<number>,
  shadowColor: GMConfigItem<string>,
  logEvents: GMConfigItem<boolean>,
  filterExp: GMConfigItem<expEval.parse.Expression>,
  // displayMatrix: ConfigItem<readonly (readonly boolean[])[]>,
}

