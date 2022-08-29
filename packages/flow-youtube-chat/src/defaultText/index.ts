import TextKey from '@/TextKey';

const defaultText = {
  setting: ['Settings', '設定'],
  font: ['Font', 'フォント'],
  color: ['Color(Normal)', '色(通常)'],
  ownerColor: ['Color(Owner)', '色(オーナー)'],
  moderatorColor: ['Color(Moderator)', '色(モデレーター)'],
  memberColor: ['Color(Member)', '色(メンバー)'],
  feedback: ['Feedback', 'バグ報告と要望'],
  eventLog: ['Event log', 'イベントログ'],
  // eslint-disable-next-line max-len
  giveFeedback: [
    // eslint-disable-next-line max-len
    'Give your feedbacks here(Please attach the event log if they\'re bug related)',
    'バグ報告、要望はこちら(バグの場合は、イベントログを添付してください)',
  ],
  chatOpacity: ['Opacity', '不透明度'],
  fontSize: ['Size', 'サイズ'],
  fontWeight: ['Weight', '太さ'],
  shadowFontWeight: ['Weight(Shadow)', '太さ(影)'],
  flowSpeed: ['Speed', '速度'],
  maxChatCount: ['Max number of chats', '最大表示数'],
  maxChatLength: ['Max number of characters', '最大文字数'],
  laneCount: ['Number of rows', '行数'],
  bannedWords: ['Banned Words', 'NGワード'],
  bannedWordRegexs: ['Banned Words(Regex)', 'NGワード(正規表現)'],
  bannedUsers: ['Banned Users', 'NGユーザー'],
  simplifyChatField: ['Simplify', '簡略化する'],
  createBanButton: ['Show ban button', 'NGボタンを表示する'],
  displayModName: ['Show moderator\'s name', 'モデレーターの名前を表示する'],
  displaySuperChatAuthor: ['Show super chat author', 'スパチャの作成者を表示する'],
  createChats: ['Display flowing chats', 'チャットを流す'],
  textOnly: ['Text only(ignore emojis)', '文字のみ(絵文字を無視する)'],
  error: ['Error', 'エラー'],
  video: ['Video', '画面'],
  chatField: ['Chat Window', 'チャット欄'],
  useStepTiming: ['Move chat in steps', 'チャットを段階的に動かす'],
  timingStepCount: ['└Step Count', '└段階数'],
  chatFilter: ['Chat Filter', 'チャットフィルター'],
  flowChat: ['Flow Chat', 'チャット流れ'],
  clearFlowChats: ['Clear Flowing Chats', '流れるチャットをクリアする'],
  // eslint-disable-next-line max-len
  flowNewChatIf: ['A new chat will appear if all of the followings are met:', '新しいチャットは以下のすべてを満たす場合に流れます：'],
  noOverlap: ['└Chats won\'t overlap', '└他のチャットと重ならない'],
  minSpacing: ['Min spacing between chats', 'チャットの最小間隔'],
  fieldScale: ['Scale', '拡大率'],
  copy: ['Copy', 'コピーする'],
  showChat: ['Show chats', 'チャット非表示'],
  hideChat: ['Hide chats', 'チャット表示'],
  flowY1: ['Flow area top edge', '流れ範囲の上端'],
  flowY2: ['Flow area bottom edge', '流れ範囲の下端'],
  flowX1: ['Flow area left edge', '流れ範囲の左端'],
  flowX2: ['Flow area right edge', '流れ範囲の右端'],
  shadowColor: ['Color(Shadow)', '色(影)'],
  invalidColor: ['Invalid color', '無効な色'],
  inputNonNumberic: ['Input isn\'t a number', '入力値が数字でない'],
  invalidSetting: ['Invalid setting', '無効な設定値'],
} satisfies {
  [key in TextKey]: string[]
};

export default defaultText;
