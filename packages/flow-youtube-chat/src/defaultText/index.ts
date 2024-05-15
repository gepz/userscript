import TextKey from '@/TextKey';

export default {
  setting: ['Settings', '設定', '设置'],
  font: ['Font', 'フォント', '字体'],
  color: ['Color(Normal)', '色(通常)', '颜色（正常）'],
  ownerColor: ['Color(Owner)', '色(オーナー)', '颜色（主人）'],
  moderatorColor: ['Color(Moderator)', '色(モデレーター)', '颜色（管理员）'],
  memberColor: ['Color(Member)', '色(メンバー)', '颜色（成员）'],
  feedback: ['Feedback', 'バグ報告と要望', '反馈'],
  eventLog: ['Event log', 'イベントログ', '事件日志'],
  giveFeedback: [
    'Give your feedbacks here(Please attach the event log for bug reports)',
    'バグ報告、要望はこちら(バグの場合は、イベントログを添付してください)',
    '在此处提供您的反馈（如报告错误,请附上事件日志）',
  ],
  chatOpacity: ['Opacity', '不透明度', '不透明度'],
  fontSize: ['Size', 'サイズ', '字体大小'],
  fontWeight: ['Weight', '太さ', '字体粗细'],
  shadowFontWeight: ['Shadow Weight', '影の太さ', '阴影粗细'],
  flowSpeed: ['Speed', '速度', '弹幕速度'],
  maxChatCount: ['Max number of chats', '最大表示数', '最大聊天数量'],
  maxChatLength: ['Max number of characters', '最大文字数', '最大字符数'],
  laneCount: ['Number of rows', '行数', '行数'],
  bannedWords: ['Banned Words', 'NGワード', '屏蔽词'],
  bannedWordRegexes: ['Banned Words(Regex)', 'NGワード(正規表現)', '屏蔽词（正则表达式）'],
  bannedUsers: ['Banned Users', 'NGユーザー', '屏蔽用户'],
  simplifyChatField: ['Simplify', '簡略化する', '简化聊天栏'],
  createBanButton: ['Show ban button', 'NGボタンを表示する', '显示屏蔽按钮'],
  displayModName: [
    "Show moderator's name",
    'モデレーターの名前を表示する',
    '显示管理员姓名',
  ],
  displaySuperChatAuthor: [
    'Show super chat author',
    'スパチャの作成者を表示する',
    '显示超级留言作者',
  ],
  createChats: ['Create flowing chats', 'チャットを流す', '创建弹幕'],
  textOnly: ['Text only(ignore emojis)', '文字のみ(絵文字を無視する)', '仅文本（忽略表情符号）'],
  error: ['Error', 'エラー', '错误'],
  video: ['Video', '画面', '视频'],
  chatField: ['Chat Window', 'チャット欄', '聊天窗口'],
  useStepTiming: ['Move chat in steps', 'チャットを段階的に動かす', '按步骤移动弹幕'],
  timingStepCount: ['└Step Count', '└段階数', '└步骤数'],
  chatFilter: ['Chat Filter', 'チャットフィルター', '聊天过滤器'],
  flowChat: ['Flow Chat', 'チャット流れ', '聊天弹幕'],
  clearFlowChats: ['Clear Flowing Chats', '流れるチャットをクリアする', '清除弹幕'],
  flowNewChatIf: [
    'A new chat will appear if all of the followings are met:',
    '新しいチャットは以下のすべてを満たす場合に流れます：',
    '如果满足以下所有条件，新弹幕会出现：',
  ],
  noOverlap: ["└Chats won't overlap", '└他のチャットと重ならない', '└弹幕不会重叠'],
  minSpacing: ['Min spacing between chats', 'チャットの最小間隔', '弹幕间的最小间距'],
  fieldScale: ['Scale', '拡大率', '缩放比例'],
  copy: ['Copy', 'コピーする', '复制'],
  showChats: ['Show chats', 'チャットを表示する', '显示弹幕'],
  hideChats: ['Hide chats', 'チャットを非表示にする', '隐藏弹幕'],
  flowY1: ['Flow area top edge', '流れ範囲の上端', '显示区域上边缘'],
  flowY2: ['Flow area bottom edge', '流れ範囲の下端', '显示区域下边缘'],
  flowX1: ['Flow area left edge', '流れ範囲の左端', '显示区域左边缘'],
  flowX2: ['Flow area right edge', '流れ範囲の右端', '显示区域右边缘'],
  shadowColor: ['Shadow Color', '影の色', '阴影颜色'],
  invalidColor: ['Invalid color', '無効な色', '无效颜色'],
  inputNonNumberic: ["Input isn't a number", '入力値が数字でない', '输入值非数字'],
  invalidSetting: ['Invalid setting', '無効な設定値', '无效的设置值'],
  logEvents: ['Enable event logging', 'イベントログを有効にする', '启用事件日志'],
  importLog: ['Import event log', 'イベントログを取り込む', '导入事件日志'],
} as const satisfies Record<TextKey, readonly string[]>;
