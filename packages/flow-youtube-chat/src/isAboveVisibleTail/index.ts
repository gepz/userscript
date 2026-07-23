// Whether the chat sits more than one viewport-height above the end of
// the chat list — outside the tail a bottom-pinned viewer sees. A seek
// rebuilds the list with one bulk insert whose upper reaches (superchats
// especially, seeded for the ticker) the viewer never sees, while live
// chatter — and the visibly re-played tail of a seek — lands at the end.
// Deliberately measured between the chat's and the list's boxes, never
// against the scroll window: mid-rebuild the scroll state passes through
// transient positions (the geometry trace once caught the whole backfill
// below the viewport), but a translation of the whole list moves both
// boxes equally, so this verdict is stable at any instant of the rebuild.
// A detached element is never visible; a missing scroller ancestor
// (markup drift) fails open as visible, degrading to always-flow.
export default (chat: HTMLElement): boolean => {
  const list = chat.parentElement;

  if (!chat.isConnected || list === null) {
    return true;
  }

  const scroller = chat.closest('#item-scroller');

  return scroller !== null
    && list.getBoundingClientRect().bottom
    - chat.getBoundingClientRect().bottom > scroller.clientHeight;
};
