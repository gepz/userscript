---
'flow-youtube-chat': patch
---

At the max-chat cap, a new chat that finds no room to flow (congested
lanes) no longer removes a flowing chat: eviction now happens only after
the newcomer is actually placed, and a dropped newcomer is discarded
instead of invisibly occupying a slot.
