---
'@userscript/flow-youtube-chat': patch
---

The custom font text input in Chat Appearance works again: its event
handlers were never attached (an unapplied curried call), so typed font
names were silently ignored.
