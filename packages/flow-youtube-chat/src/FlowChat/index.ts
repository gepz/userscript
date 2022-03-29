import * as O from 'fp-ts/Option';

import ChatData from '@/ChatData';
import UserConfigGetter from '@/UserConfigGetter';

export default interface FlowChat {
  getData: (getConfig: UserConfigGetter) => ChatData,
  element: HTMLElement,
  lane: number,
  animation: O.Option<Animation>,
  animationDuration: number,
  animationEnded: boolean,
  width: number,
  height: number,
  y: number,
}
