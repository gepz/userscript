import UserConfig from '@/UserConfig';

const listeningBroadcastConfigKeys: (keyof UserConfig)[] = [
  'lang',
  'bannedWords',
  'bannedWordRegexes',
  'bannedUsers',
  'filterExp',
  'simplifyChatField',
  'createBanButton',
  'fieldScale',
];

export default listeningBroadcastConfigKeys;
