import AnimatingState from 'src/AnimatingState';

import ChatData from '@/ChatData';

export default interface FlowChat {
  data: ChatData,
  element: HTMLElement,
  lane: number,
  animationState: AnimatingState,
  width: number,
  height: number,
  y: number,
}
