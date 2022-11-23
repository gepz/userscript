import * as expEval from 'expression-eval';

import ConfigItem from '@/ConfigItem';
import languages from '@/languages';

export default interface GMConfig {
  lang: ConfigItem<typeof languages[number]>,
  font: ConfigItem<string>,
  color: ConfigItem<string>,
  ownerColor: ConfigItem<string>,
  moderatorColor: ConfigItem<string>,
  memberColor: ConfigItem<string>,
  chatOpacity: ConfigItem<number>,
  fontSize: ConfigItem<number>,
  fontWeight: ConfigItem<number>,
  shadowFontWeight: ConfigItem<number>,
  maxChatCount: ConfigItem<number>,
  flowSpeed: ConfigItem<number>,
  maxChatLength: ConfigItem<number>,
  laneCount: ConfigItem<number>,
  bannedWords: ConfigItem<readonly string[]>,
  bannedWordRegexs: ConfigItem<readonly string[]>,
  bannedUsers: ConfigItem<readonly string[]>,
  createChats: ConfigItem<boolean>,
  displayChats: ConfigItem<boolean>,
  createBanButton: ConfigItem<boolean>,
  simplifyChatField: ConfigItem<boolean>,
  displayModName: ConfigItem<boolean>,
  displaySuperChatAuthor: ConfigItem<boolean>,
  textOnly: ConfigItem<boolean>,
  timingFunction: ConfigItem<string>,
  noOverlap: ConfigItem<boolean>,
  minSpacing: ConfigItem<number>,
  fieldScale: ConfigItem<number>,
  flowY1: ConfigItem<number>,
  flowY2: ConfigItem<number>,
  flowX1: ConfigItem<number>,
  flowX2: ConfigItem<number>,
  shadowColor: ConfigItem<string>,
  filterExp: ConfigItem<expEval.parse.Expression>,
  // displayMatrix: ConfigItem<readonly (readonly boolean[])[]>,
}
