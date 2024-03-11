import * as O from 'effect/Option';

import ChatData from '@/ChatData';

export default interface FlowChat {
  data: ChatData,
  element: HTMLElement,
  lane: number,
  animation: O.Option<Animation>,
  animationEnded: boolean,
  width: number,
  height: number,
  y: number,
}
