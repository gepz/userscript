import UserConfig from '@/UserConfig';

const listeningBroadcastConfigKeys: (keyof UserConfig)[] = [
  'lang',
  'bannedWords',
  'bannedWordRegexs',
  'bannedUsers',
  'filterExp',
  'simplifyChatField',
  'createBanButton',
  'fieldScale',
];

export default listeningBroadcastConfigKeys;
