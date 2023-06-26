import languages from '@/languages';

export default interface ToggleChatButtonState {
  displayChats: boolean,
  lang: typeof languages[number],
}
