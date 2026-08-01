---
'@userscript/flow-youtube-chat': minor
---

Add excluded lanes: a toggle strip under the lane-count setting marks
lanes that flowing chats must never enter, regardless of the no-overlap
setting. Cells toggle by click or click-and-drag painting, and a
half-transparent player overlay previews the excluded lanes while the
pointer is over the strip, lingering briefly after each toggle for
devices without hover. Toggling a lane immediately re-lays out the
chats already flowing, moving them out of excluded lanes (or removing
them, when no-overlap is on and nowhere fits). Shrinking the lane count
permanently drops
now-out-of-range lanes from the excluded set. With every lane excluded,
no new chats flow.
