import * as O from 'effect/Option';

import ChatData from '@/ChatData';
import UserConfig from '@/UserConfig';

export default interface FlowChat {
  getData: (config: UserConfig) => ChatData,
  element: HTMLElement,
  lane: number,
  animation: O.Option<Animation>,
  animationEnded: boolean,
  width: number,
  height: number,
  y: number,
}

