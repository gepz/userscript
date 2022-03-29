import UserConfigGetter from '@/UserConfigGetter';

export default interface MainState {
  chatPlaying: boolean;
  playerRect: DOMRect;
  getConfig: UserConfigGetter;
}
